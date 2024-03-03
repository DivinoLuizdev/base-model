import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AbstractForm } from 'src/app/model/abastract-form';
import { Cliente } from 'src/app/model/cliente';
import { ClienteService } from 'src/app/service/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent extends AbstractForm implements OnInit {
  clientes: Cliente[] = [];
  clienteSelecionado = new Cliente();
  displayCadastro = false;
 
  constructor(private clienteService: ClienteService,
    private ms: MessageService) { 
      super(ms);
    }

  ngOnInit(): void {
    this.carregarClientes();
  }

  filtrarPorNome(filtro: string) {
    this.clienteService.listaClientes().subscribe(res => {
      if(res && res.length > 0) {
        console.log(res, filtro);
        this.clientes = res.filter(cliente => cliente.nome.toLowerCase().includes(filtro.toLowerCase()));
      }
    }, error => {
      this.notification.showErro('Erro ao carregar lista de clientes');
    }); 
  }

  carregarClientes() {
    this.clienteService.listaClientes().subscribe(res => {
      this.clientes = res;
    }, error => {
      this.notification.showErro('Erro ao carregar lista de clientes');
    });
  }

  async deletarCliente(id: number): Promise<void> {
    try {
      await this.clienteService.deletarCliente(id).toPromise();
      this.clientes = this.clientes.filter((cliente) => cliente.id !== id);
      this.notification.showSucesso('Cliente excluído com sucesso.');
    } catch (error) {
      this.notification.showErro(`Erro ao excluir cliente ${id}: ${error}`);
    }
   }

   showDialogCadastro() {
    this.clienteSelecionado = new Cliente();
    this.displayCadastro = true;
   }

   showDialogEdit(cliente: Cliente) {
    this.clienteSelecionado = cliente;
    this.displayCadastro = true;
   }

   afterSave(cliente: Cliente) {
    this.carregarClientes();
    this.displayCadastro = false;
   }
}
