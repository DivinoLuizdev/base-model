import { Cliente } from 'src/app/model/cliente';
import { Estados } from './../../model/estados';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/service/cliente.service';
import { EstadoCivil } from '../../model/estado-civil';
import { Emprestimo } from 'src/app/model/emprestimo';
import { AbstractForm } from 'src/app/model/abastract-form';
import { Parcela } from 'src/app/model/parcela';
import { MessageService } from 'primeng/api';
import { StatusEmprestimo } from 'src/app/model/status-emprestimo';
import { Pagamento } from 'src/app/model/pagamento';


@Component({
  selector: 'app-cadastro-clientes',
  templateUrl: './cadastro-clientes.component.html',
  styleUrls: ['./cadastro-clientes.component.scss']
})
export class CadastroClientesComponent extends AbstractForm implements OnInit, OnChanges {
  estadosCivis = Object.values(EstadoCivil);
  estados = Object.values(Estados);
  displayEmprestimo = false;
  displayPagamento = false;
  listaStatus: StatusEmprestimo[] = [];
  listaParcelas: number[] = [];
  clonedParcelas: Parcela[] = [];
  editingIndex = -1;
  displayNovoPagamento = false;
  pagamento: Pagamento = new Pagamento();
  parcelaPagamento: Parcela;

  @Input() cliente: Cliente;
  @Input() somenteCrediario: boolean
  @Output() saveEvent: EventEmitter<Cliente> = new EventEmitter()
  emprestimo: Emprestimo = new Emprestimo();
  constructor(private clienteService: ClienteService,
    private messageService: MessageService) {
    super(messageService);

  }


  mostrarCamposConjuge: boolean = false;

  ngOnInit() {
    this.listaParcelas = [1, 2, 4, 5, 10];
    this.listaStatus = [
      StatusEmprestimo.PENDENTE,
      StatusEmprestimo.APROVADO,
      StatusEmprestimo.NEGADO,
      StatusEmprestimo.QUITADO,
      StatusEmprestimo.EM_ATRASO,
      StatusEmprestimo.OUTRO
    ]
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

  onChangeEstadoCivil(event: any) {
    const estadoCivil = event.target.value;

    if (estadoCivil === 'SOLTEIRO' || estadoCivil === 'VIÚVO' || estadoCivil === 'DIVORCIADO') {
      this.mostrarCamposConjuge = false;
    } else {
      this.mostrarCamposConjuge = true;
    }
  }

  salvar() {
    this.clienteService.criarCliente(this.cliente).subscribe(res => {
      this.notification.showSucesso('Dados Gravados com sucesso');
      this.saveEvent.emit(this.cliente);
      this.resetForm();
    }, error => {
      this.notification.showErro('Falha ao adicionar cliente. Entre em contato com o suporte para mais informações');
      console.log(error);
    });
  }

  validarAoSalvar() {
    if (!this.cliente.id || this.cliente.id === 0) {
      this.clienteService.listarPorCpf(this.cliente.documento.cpf).subscribe(res => {
        if (!res) {
          this.salvar();
        } else {
          this.notification.showAlerta('Já existe um Cliente cadastrado com esse CPF');
        }
      });
    } else {
      this.salvar();
    }
  }

  resetForm() {
    this.cliente = new Cliente();
    this.emprestimo = new Emprestimo();
    this.displayEmprestimo = false;
    this.listaParcelas = [];
    this.clonedParcelas = [];
    this.editingIndex = -1;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cliente'] && !this.cliente.id && this.cliente.id <= 0) {
      this.cliente = new Cliente();
      this.emprestimo = new Emprestimo();
      this.displayEmprestimo = false;
      this.somenteCrediario = false;
    }
  }

  novoEmprestimo() {
    this.editingIndex - 1;
    this.emprestimo = new Emprestimo();
    this.listaParcelas = [1, 2, 4, 5, 10];
    this.displayEmprestimo = true;
  }

  editarEmprestimo(emprestimo: Emprestimo, index: number) {
    this.editingIndex = index;
    this.listaParcelas = [1, 2, 4, 5, 10];
    emprestimo.dataInicial = this.convertDateToString(emprestimo.dataInicial);
    this.emprestimo = emprestimo;
    this.displayEmprestimo = true;
  }

  calcularParcelasEmprestimo() {
    if (!this.validarNovoEmprestimo()) {
      return;
    }
    let valorTotal = 0;
    let saldoDevedor = this.emprestimo.valor;
    let valorParcela = this.emprestimo.valor / this.emprestimo.numeroParcela;
    let vencimentoAtual = this.convertToDate(this.emprestimo.dataInicial);
    let dataTermino: Date = null;

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

      this.emprestimo.parcelas.push(parcela);
      dataTermino = vencimentoAtual;
    }
    
    this.emprestimo.valorTotal = valorTotal;
    this.emprestimo.dataFinal = dataTermino;
    this.emprestimo.dataInicial = this.emprestimo.dataInicial;
  }

  validarNovoEmprestimo(): boolean {
    let valido = true;

    if (!this.emprestimo.valor || this.emprestimo.valor === 0) {
      valido = false;
      this.notification.showErro("O campo 'Valor' é obrigatório e deve ser maior que 0");
    }

    if (!this.emprestimo.numeroParcela) {
      valido = false;
      this.notification.showErro("O campo 'Quantidade Parcelas' é obrigatório");
    }

    if (!this.emprestimo.dataInicial) {
      valido = false;
      this.notification.showErro("O campo 'Vencimento 1ª Parcela' é obrigatório");
    }

    if (!this.isValidDate(this.emprestimo.dataInicial)) {
      valido = false;
      this.notification.showErro("Informe uma data válida para o campo 'Vencimento 1ª Parcela");
    }

    const hoje = new Date();
    const data = this.convertToDate(this.emprestimo.dataInicial);
    if (data <= hoje) {
      valido = false;
      this.notification.showErro("A data de vencimento da 1ª parcela deve ser maior ou igual a data de hoje");
    }

    return valido;
  }

  validarParcelamento(): boolean {
    if (!this.validarNovoEmprestimo()) {
      return false;
    }

    if (this.emprestimo.parcelas.length <= 0) {
      this.notification.showAlerta("Clique na opção 'Calcular' para gerar o parcelamento.");
      return false;
    }

    for (const p of this.emprestimo.parcelas) {
      const hoje = new Date();
      const data = this.convertToDate(p.dataVencimento);
      if (data <= hoje) {
        this.notification.showAlerta(`A data de vencimento da parcela de nº ${p.numParcela} não pode ser menor que a data de hoje.`);
        return false;
      }
    }
    return true;
  }

  onRowEditInit(parcela: Parcela) {
    parcela.dataVencimento = this.convertDateToString(parcela.dataVencimento);
    this.clonedParcelas[parcela.numParcela] = { ...parcela };
  }

  onRowEditSave(parcela: Parcela) {
    if (!this.validarParcelamento()) {
      return;
    }
    const parcelaAnterior = this.clonedParcelas[parcela.numParcela];
    parcela.dataVencimento = this.convertToDate(parcela.dataVencimento);
    this.emprestimo.valorTotal -= parcelaAnterior.valorParcela - parcelaAnterior.valorJuros;
    this.emprestimo.valorTotal += parcela.valorParcela + parcela.valorJuros;

    delete this.clonedParcelas[parcela.numParcela];
  }

  onRowEditCancel(parcela: Parcela, index: number) {
    this.emprestimo.parcelas[index] = this.clonedParcelas[parcela.numParcela];
    delete this.clonedParcelas[parcela.numParcela];
  }

  adicionarEmprestimo() {
    if (!this.validarParcelamento() || !this.validarNovoEmprestimo()) {
      return;
    }

    this.emprestimo.dataInicial = this.convertToDate(this.emprestimo.dataInicial);
    if (this.editingIndex === -1) {
      this.cliente.emprestimos.push({ ...this.emprestimo });
    } else {
      this.cliente.emprestimos[this.editingIndex] = this.emprestimo;
    }
    this.emprestimo = new Emprestimo();
    this.displayEmprestimo = false;
  }

  obterDescricaoStatus(status: any): string {
    if (status == 0 || status == 'PENDENTE' || status == StatusEmprestimo.PENDENTE) {
      return 'Pendente';
    } else if (status == 1 || status == 'APROVADO' || status == StatusEmprestimo.APROVADO) {
      return 'Aprovado';
    } else if (status == 2 || status == 'NEGADO' || status == StatusEmprestimo.NEGADO) {
      return 'Negado';
    } else if (status == 3 || status == 'QUITADO' || status == StatusEmprestimo.QUITADO) {
      return 'Quitado';
    } else if (status == 4 || status == 'EM_ATRASO' || status == StatusEmprestimo.EM_ATRASO) {
      return 'Em Atraso';
    } else {
      return 'Outro';
    }
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Pago':
        return 'success';
      case 'A Vencer' || 'Pago parcial':
        return 'warning';
      case 'Em Atraso':
        return 'danger';
    }
    return '';
  }

  excluirEmprestimo(emp: Emprestimo, index: number) {
    if (emp.id > 0) {
      this.clienteService.deletarEmprestimo(emp.id).subscribe(res => {
        this.notification.showSucesso('Registro excluído com sucesso.');
      });
    } else {
      this.notification.showSucesso('Registro excluído com sucesso.');
    }

    if (index > -1 && index < this.cliente.emprestimos.length) {
      this.cliente.emprestimos.splice(index, 1);
    } else {
      this.notification.showErro('Falha ao excluir item da lista.')
      return;
    }
  }

  showDialogPagamento(e: Emprestimo, index: number) {
    this.emprestimo = e;
    this.displayPagamento = true;
    this.displayNovoPagamento = false;
    this.calcularAReceber(null);
    for (let p of e.parcelas) {
      this.popularStatusPagamento(p);
    }
  }

  popularStatusPagamento(parcela: Parcela) {
    let status = 'A Vencer';

    if (parcela.pagamentos && parcela.pagamentos.length > 0) {
      let somaPagamento = 0;
      for (const pg of parcela.pagamentos) {
        somaPagamento += pg.valorPago;
      }
      if (somaPagamento === parcela.valorJuros + parcela.valorParcela) {
        status = 'Pago';
      } else {
        status = 'Pago Parcial'
      }
    } else if (this.convertToDate(parcela.dataVencimento) < new Date()) {
      status = 'Em Atraso'
    }
    parcela.statusParcela = status;
  }

  calcularAReceber(p: Parcela): number {
    if (!p) {
      let receber = this.emprestimo.valorTotal;

      for (let p of this.emprestimo.parcelas) {
        if (p.pagamentos && p.pagamentos.length > 0) {
          for (let pg of p.pagamentos) {
            receber -= pg.valorPago;
          }
        }
      }
      this.emprestimo.valorAReceber = receber;
      return null;
    } else {
      let receber = p.valorJuros + p.valorParcela;

      for(let pg of p.pagamentos) {
        receber -= pg.valorPago;
      }
      return receber;
    }
  }

  showNovoPagamento(p: Parcela) {
    this.pagamento = new Pagamento();
    this.pagamento.dataPagamento = new Date();
    this.parcelaPagamento = p;
    this.displayNovoPagamento = true;
  }

  registrarPagamento() {
    const areceber = this.calcularAReceber(this.parcelaPagamento);
    if(this.pagamento.valorPago > areceber) {
      this.notification.showAlerta('O valor pago ultrapassa o valor a receber.');
      return ;
    } 
    if (!this.parcelaPagamento.pagamentos) {
      this.parcelaPagamento.pagamentos = [];
    }
    this.parcelaPagamento.pagamentos.push(this.pagamento);
    this.calcularAReceber(null);
    this.popularStatusPagamento(this.parcelaPagamento);
    this.clienteService.registrarPagamento(this.parcelaPagamento).subscribe(res => {
      this.displayNovoPagamento = false;
      this.notification.showSucesso('Pagamento registrado com sucesso.');
    });

  }
}
