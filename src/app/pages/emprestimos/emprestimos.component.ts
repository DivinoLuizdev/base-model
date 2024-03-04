import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AbstractForm } from 'src/app/model/abastract-form';
import { Cliente } from 'src/app/model/cliente';
import { Emprestimo, EmprestimoDTO } from 'src/app/model/emprestimo';
import { Parcela } from 'src/app/model/parcela';
import { StatusEmprestimo } from 'src/app/model/status-emprestimo';
import { ClienteService } from 'src/app/service/cliente.service';



@Component({
  selector: 'app-emprestimos',
  templateUrl: './emprestimos.component.html',
  styleUrls: ['./emprestimos.component.scss']
})
export class EmprestimosComponent extends AbstractForm implements OnInit {

  emprestimos: EmprestimoDTO[] = [];
  emprestimo: Emprestimo;
  cliente: Cliente;
  displayPagamento = false;

  pesquisaStatus = '';
  listaStatus: string[] = ['', 'A Vencer', 'Pago', 'Pago Parcial', 'Em Atraso', 'Inadimplente'];
  pesquisaDataIni: Date;
  pesquisaDataFim: Date;
  constructor(
    private clienteService: ClienteService,
    private mg: MessageService) {
    super(mg);
  }

  ngOnInit(): void {
    this.listarEmprestimos();
  }

  popularEmprestimos(cliente: Cliente) {
    for (let e of cliente.emprestimos) {
      let emprestimo = new EmprestimoDTO(cliente, e);
      this.emprestimos.push(emprestimo);
    }
  }

  getClassStatus(status: string) {
    switch (status) {
      case 'A Vencer':
        return 'bg-info';
      case 'Pago':
        return 'bg-success';
      case 'Pago Parcial':
        return 'bg-warning';
      case 'Em Atraso':
      case 'Inadimplente':
        return 'bg-danger'
    }
    return 'bg-info'
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Pago':
        return 'success';
      case 'A Vencer':
      case 'Pago parcial':
        return 'warning';
      case 'Em Atraso':
      case 'Inadimplente':
        return 'danger';
      default:
        return '';
    }
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

      for (let pg of p.pagamentos) {
        receber -= pg.valorPago;
      }
      return receber;
    }
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

  visualizarDetalhe(e: EmprestimoDTO) {
    this.emprestimo = e.emprestimo;
    this.cliente = e.clienteEmprestimo;
    this.calcularAReceber(null);
    if(e.clienteEmprestimo.inadimplente) {
      e.status = 'Inadimplente';
    } 
    for (let p of this.emprestimo.parcelas) {
      this.popularStatusPagamento(p);
    }
    this.displayPagamento = true;
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

  listarEmprestimos(filtrar: boolean = false) {
    let cont = 0; //garantir que as duas datas sejam informadas e não apenas uma
    this.pesquisaDataIni ? cont += 1 : cont += 0;
    this.pesquisaDataFim ? cont += 1 : cont += 0;

    if (filtrar && cont == 1) {
      this.notification.showAlerta('Para pesquisar por data é necessário informar Data Início e Término');
      return;
    }
    this.clienteService.listaClientes().subscribe(res => {
      this.emprestimos = [];
      if (res && res.length > 0) {
        for (let cliente of res) {
          this.popularEmprestimos(cliente);
        }
      }
      if (filtrar) {
        this.filtrar();
      }
    });
  }

  filtrar() {
    const hoje = new Date();
    let dataIni = this.pesquisaDataIni ? this.pesquisaDataIni : new Date('1900-01-01');
    let dataFim = this.pesquisaDataFim ? this.pesquisaDataFim : hoje.setFullYear(hoje.getFullYear() + 5);

    let lista: EmprestimoDTO[] = [];
    if (this.pesquisaStatus === 'Pago' || this.pesquisaStatus === 'Pago Parcial') {
      lista = this.emprestimos.filter(e =>
        e.emprestimo.parcelas.some(p =>
          p.pagamentos.some(pg =>
            this.convertToDate(pg.dataPagamento) >= dataIni && this.convertToDate(pg.dataPagamento) <= dataFim)));
    } else if (this.pesquisaStatus === 'A Vencer') {
      lista = this.emprestimos.filter(e =>
        this.convertToDate(e.proximoPgto) >= dataIni && this.convertToDate(e.proximoPgto) <= dataFim
        && e.status === this.pesquisaStatus);
    } else if(this.pesquisaStatus === '') {
      lista = this.emprestimos;
    } else {
      lista = this.emprestimos.filter(e =>
        e.status === this.pesquisaStatus);
    }
    this.emprestimos = lista;
  }

  registrarInadimplente() {
    this.cliente.inadimplente = true;
    this.clienteService.criarCliente(this.cliente).subscribe(res => {
      this.listarEmprestimos();
      this.notification.showSucesso('Cliente Marcado como Inadimplente');
      this.displayPagamento = false;
    });
  }

}