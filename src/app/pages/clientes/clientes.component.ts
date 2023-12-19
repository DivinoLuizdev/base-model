import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/model/cliente';
import { ClienteService } from 'src/app/service/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = []; // Agora é uma lista de clientes

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.obterDadosClientes();
  }

  obterDadosClientes() {
    this.clienteService.obterClientes().subscribe(
      (data: Cliente[]) => {
        this.clientes = data; // Atribui a lista de clientes diretamente à variável clientes

        console.log(this.clientes); // Log da lista de clientes recebida da API
      },
      error => {
        console.error('Erro ao obter dados dos clientes:', error);
      }
    );
  }
}
