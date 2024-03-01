import { Cliente } from 'src/app/model/cliente';
import { Estados } from './../../model/estados';

import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/service/cliente.service';
import { EstadoCivil } from '../../model/estado-civil';
import { Emprestimo } from 'src/app/model/emprestimo';
import { AbstractForm } from 'src/app/model/abastract-form';
import { Parcela } from 'src/app/model/parcela';


@Component({
  selector: 'app-cadastro-clientes',
  templateUrl: './cadastro-clientes.component.html',
  styleUrls: ['./cadastro-clientes.component.scss']
})
export class CadastroClientesComponent extends AbstractForm implements OnInit, OnChanges {
  formulario: any = {};
  estadosCivis = Object.values(EstadoCivil);
  estados = Object.values(Estados);
  displayEmprestimo = false;
  listaParcelas: number[] = [];
  clonedParcelas: Parcela[] = [];

  @Input() cliente: Cliente;
  emprestimo: Emprestimo = new Emprestimo();
  emprestimos: Emprestimo[] = [];
  constructor(private formBuilder: FormBuilder, private clienteService: ClienteService) {
    super();
  }


  mostrarCamposConjuge: boolean = false;

  ngOnInit() {
    this.listaParcelas = [1, 2, 4, 5, 10];
  }

  telefoneValido(input: any, form: any) {
    if (input.dirty || form.submitted) {
      return this.formatarTelefone(input);
    }
    return true;
  }

  formatarTelefone(input: any): boolean {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length === 11 || valor.length === 0) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1)$2-$3');
      if (input.name === 'fone') {
        this.cliente.contato.telefone = valor;
      } else {
        this.cliente.contato.telefoneConjuge = valor;
      }

      return true;
    } else {
      return false;
    }
  }

  validarCEP(): boolean {
    if (!this.cliente.endereco.cep || this.cliente.endereco.cep.length === 0) {
      return true;
    }
    return this.cliente.endereco.cep.replace(/\D/g, '').length === 8;
  }

  formatarCEP(): string {
    if (!this.cliente.endereco.cep || this.cliente.endereco.cep.length === 0) {
      return "";
    }
    let cep = this.cliente.endereco.cep.replace(/\D/g, '');

    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  formatarCPF(event: any) {
    const regex = /\d{11}/;
    const digitos = event.target.value.match(regex)[0];
    const cpfFormatado = `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9, 11)}`;
    this.cliente.documento.cpf = cpfFormatado;
  }

  validarCPF(): boolean {
    if (this.cliente.documento.cpf.length === 0) {
      return true;
    }
    let cpf = this.cliente.documento.cpf;
    cpf = cpf.replace(/\D/g, "");

    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) {
      return false;
    }

    // Verifica se todos os dígitos são iguais
    if (cpf.charAt(0).repeat(11) === cpf) {
      return false;
    }

    // Cálculo do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += (10 - i) * parseInt(cpf.charAt(i));
    }
    let primeiroDigito = soma % 11;
    primeiroDigito = primeiroDigito < 2 ? 0 : 11 - primeiroDigito;

    // Cálculo do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += (11 - i) * parseInt(cpf.charAt(i));
    }
    let segundoDigito = soma % 11;
    segundoDigito = segundoDigito < 2 ? 0 : 11 - segundoDigito;

    // Verifica se os dígitos verificadores são iguais aos informados
    return (
      parseInt(cpf.charAt(9)) === primeiroDigito &&
      parseInt(cpf.charAt(10)) === segundoDigito
    );
  }
  // onSubmit() {
  //   if (this.formulario.valid) {
  //     console.log(this.formulario.value);


  //     this.formulario.value.endereco.cep = this.formatarCEP( this.formulario.value.endereco.cep)
  //     this.formulario.value.localTrabalho.cep  = this.formatarCEP(this.formulario.value.localTrabalho.cep )
  //     this.formulario.value.localTrabalho.estado =   "GO"
  //     // formatarCEP(cep: string)
  //     // this.formatarTelefone(event: any)
  //     // Chame o serviço para enviar os dados para o backend
  //     this.clienteService.criarCliente(this.formulario.value).subscribe(
  //       response => {
  //         console.log('Cliente criado com sucesso!', response);
  //       },
  //       error => {
  //         console.error('Erro ao criar cliente', error);
  //       }
  //     );
  //   } else {
  //     // Formulário inválido, manipule conforme necessário
  //   }
  // }

  onChangeEstadoCivil(event: any) {
    const estadoCivil = event.target.value;

    if (estadoCivil === 'SOLTEIRO' || estadoCivil === 'VIÚVO' || estadoCivil === 'DIVORCIADO') {
      this.mostrarCamposConjuge = false;
    } else {
      this.mostrarCamposConjuge = true;
    }
  }

  salvar() {
    console.log(this.emprestimo);
    console.log(this.cliente);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cliente']) {
      this.cliente = new Cliente();
      this.emprestimo = new Emprestimo();
      this.displayEmprestimo = false;
    }
  }

  novoEmprestimo() {
    this.emprestimo = new Emprestimo();
    this.displayEmprestimo = true;
  }

  calcularParcelasEmprestimo() {
    let valorTotal = 0;
    let saldoDevedor = this.emprestimo.valor;
    let valorParcela = this.emprestimo.valor / this.emprestimo.numeroParcela;
    let vencimentoAtual = this.convertToDate(this.emprestimo.dataInicial);

    this.emprestimo.parcelas = [];
    for (let i = 1; i <= this.emprestimo.numeroParcela; i++) {
      let parcela = new Parcela();
      parcela.dataVencimento = this.deepcopy(vencimentoAtual);
      parcela.valorParcela = valorParcela;
      parcela.valorJuros = (saldoDevedor * 0.1);
      parcela.numParcela = i;

      vencimentoAtual.setMonth(vencimentoAtual.getMonth() + 1);
      saldoDevedor = this.emprestimo.valor - (valorParcela * i)
      valorTotal += parcela.valorParcela + parcela.valorJuros;

      this.emprestimo.parcelas.push(parcela)
    }
    this.emprestimo.valorTotal = valorTotal;
    console.log(this.emprestimo);
  }

  onRowEditInit(parcela: Parcela) {
    parcela.dataVencimento = this.convertDateToString(parcela.dataVencimento);
    this.clonedParcelas[parcela.numParcela] = { ...parcela };
  }

  onRowEditSave(parcela: Parcela) {
    /* Adicionar validação
    if (product.price > 0) {
      delete this.clonedProducts[product.id];
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    }*/
    parcela.dataVencimento = this.convertToDate(parcela.dataVencimento);
    delete this.clonedParcelas[parcela.numParcela];
  }

  onRowEditCancel(parcela: Parcela, index: number) {
    this.emprestimo.parcelas[index] = this.clonedParcelas[parcela.numParcela];
    delete this.clonedParcelas[parcela.numParcela];
  }

}
