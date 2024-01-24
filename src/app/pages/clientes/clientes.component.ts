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
  valorEmprestimo: number;
  numeroParcelas: number;
  taxaJuros: number; // Nova propriedade para a taxa de juros
  parcelas: number[];

  constructor(private clienteService: ClienteService) {
    this.valorEmprestimo = 2000; // Valor inicial
    this.numeroParcelas = 5;    // Quantidade inicial de parcelas
    this.taxaJuros = 0;         // Taxa de juros inicial
    this.parcelas = [];
  }
  
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

  calcularParcelasIniciais(): void {
    if (!this.valorEmprestimo || !this.numeroParcelas || this.taxaJuros == null) {
      return;
    }

    this.parcelas = [];
    const jurosMensal = this.taxaJuros / 100 / this.numeroParcelas;
    for (let i = 0; i < this.numeroParcelas; i++) {
      // Lógica de cálculo com juros
      const valorParcela = (this.valorEmprestimo / this.numeroParcelas) * (1 + jurosMensal);
      this.parcelas.push(valorParcela);
    }
  }

}



