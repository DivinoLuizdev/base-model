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
 
  // clienteSelecionado: Cliente = new Cliente();
  constructor(private clienteService: ClienteService,
    private ms: MessageService) { 
      super(ms);
    }

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes() {
    this.clienteService.listaClientes().subscribe(res => {
      this.clientes = res;
    }, error => {
      this.notification.showErro('Erro ao carregar lista de clientes');
    });
  }

  // selecionarCliente(cliente: Cliente): void {
  //   this.clienteSelecionado = cliente;
  // }

  // inserirCliente(cliente: Cliente): void {
  //   this.clienteService.inserir(cliente).subscribe(
  //     (data: Cliente) => {
  //       this.clientes.push(data);
  //     },
  //     error => {
  //       console.error('Erro ao inserir cliente:', error);
  //     }
  //   );
  // }

  // atualizarCliente(cliente: Cliente): void {
  //   if (cliente.id) {
  //     this.clienteService.atualizar(cliente).subscribe(
  //       () => {
  //         const index = this.clientes.findIndex(c => c.id === cliente.id);
  //         if (index !== -1) {
  //           this.clientes[index] = cliente;
  //         }
  //       },
  //       error => {
  //         console.error('Erro ao atualizar cliente:', error);
  //       }
  //     );
  //   }
  // }

  async deletarCliente(id: number): Promise<void> {
    try {
      await this.clienteService.deletarCliente(id).toPromise();
      this.clientes = this.clientes.filter((cliente) => cliente.id !== id);
      console.log(`Cliente ${id} excluído com sucesso.`);
    } catch (error) {
      console.error(`Erro ao excluir cliente ${id}: ${error}`);
    }
   }

   showDialogCadastro() {
    this.clienteSelecionado = new Cliente();
    this.displayCadastro = true;
   }

   afterSave(cliente: Cliente) {
    this.carregarClientes();
    this.displayCadastro = false;
   }
}
