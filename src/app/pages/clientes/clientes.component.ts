import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/model/cliente';
import { ClienteService } from 'src/app/service/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
 
  // clienteSelecionado: Cliente = new Cliente();
  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
  console.log( this.getClientes())
  }

  async getClientes(): Promise<void> {
    try {
      this.clientes = await this.clienteService.listaClientes().toPromise() ?? [];
    } catch (error) {
      console.error('Erro ao buscar clientes', error);
    }
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
}
