import { Cliente } from 'src/app/model/cliente';
import { Estados } from './../../model/estados';
 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/service/cliente.service';
import { EstadoCivil } from  '../../model/estado-civil';
 

@Component({
  selector: 'app-cadastro-clientes',
  templateUrl: './cadastro-clientes.component.html',
  styleUrls: ['./cadastro-clientes.component.scss']
})
export class CadastroClientesComponent implements OnInit {
  formulario: FormGroup = new FormGroup({});
  estadosCivis = Object.values(EstadoCivil);
  estados = Object.values(Estados);
  cliente:Cliente = new Cliente()
 
  constructor(private formBuilder: FormBuilder, private clienteService: ClienteService) {}
  mostrarCamposConjuge: boolean = false;

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      nome: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      nomeConjuge: [''],
      observacao: [''],
      contato: this.formBuilder.group({
        telefone: [''],
        telefoneConjuge: [''],
        email: ['', Validators.email]
      }),
      documento: this.formBuilder.group({
        identidade: [''],
        cpf: ['']
      }),
      endereco: this.formBuilder.group({
        rua: [''],
        cidade: [''],
        cep: [''],
        estado: [''],
        numero: [''],
        complemento: [''],
        bairro: ['']
      }),
      localTrabalho: this.formBuilder.group({
        rua: [''],
        cidade: [''],
        cep: [''],
        estado: [''],
        numero: [''],
        complemento: [''],
        bairro: ['']
      })
    });
 

    
      this.onChangeEstadoCivil(this.formulario.get('estadoCivil')?.value);
   
  }    

  cepFormControl = new FormControl('', [Validators.pattern( /^\d{8}$/)]);
  telefoneControl = new FormControl('', [Validators.pattern(/^\d{11}$/)]);
  
  get cepInvalido() {
    return this.cepFormControl.hasError('pattern') && this.cepFormControl.dirty;
  }


  get telefoneValido() {
    return this.telefoneControl.hasError('pattern') && this.telefoneControl.dirty;
  }

  formatarTelefone(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length === 11) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1)$2-$3');
    }
    this.telefoneControl.setValue(valor, { emitEvent: false });
  }

  formatarCEP(cep: string): string {
   
    cep = cep.replace(/\D/g, '');
 
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}
  onSubmit() {
    if (this.formulario.valid) {
      console.log(this.formulario.value);

 
      this.formulario.value.endereco.cep = this.formatarCEP( this.formulario.value.endereco.cep)
      this.formulario.value.localTrabalho.cep  = this.formatarCEP(this.formulario.value.localTrabalho.cep )
      this.formulario.value.localTrabalho.estado =   "GO"
      // formatarCEP(cep: string)
      // this.formatarTelefone(event: any)
      // Chame o serviço para enviar os dados para o backend
      this.clienteService.criarCliente(this.formulario.value).subscribe(
        response => {
          console.log('Cliente criado com sucesso!', response);
        },
        error => {
          console.error('Erro ao criar cliente', error);
        }
      );
    } else {
      // Formulário inválido, manipule conforme necessário
    }
  }
  
  onChangeEstadoCivil(event: any) {
    const estadoCivil = event.target.value;
  
    if (estadoCivil === 'SOLTEIRO' || estadoCivil === 'VIÚVO' || estadoCivil ==='DIVORCIADO') {
      this.mostrarCamposConjuge = false;
    } else {
      this.mostrarCamposConjuge = true;
    }
  }
  
 
 
}
