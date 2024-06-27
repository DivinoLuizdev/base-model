import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AbstractForm } from 'src/app/model/abastract-form';
import { Cliente } from 'src/app/model/cliente';
import { Emprestimo, EmprestimoDTO } from 'src/app/model/emprestimo';
import { Parcela } from 'src/app/model/parcela';
import { StatusEmprestimo } from 'src/app/model/status-emprestimo';
import { ClienteService } from 'src/app/service/cliente.service';
import { EstatisticaService } from 'src/app/service/estatistica.service';



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
  listaStatus: string[] = ['', 'A Vencer', 'Pago', 'Pago Parcial', 'Em Atraso', 'Inadimplente', 'Concluído'];
  pesquisaDataIni: Date;
  pesquisaDataFim: Date;
  constructor(
    private clienteService: ClienteService,
    private mg: MessageService,
    private estatisticaService: EstatisticaService) {
    super(mg);
  }

  ngOnInit(): void {
    this.estatisticaService.sistemaValido().subscribe(res => {
      if (res) {
        this.listarEmprestimos();
      } else {
        this.notification.showSistemaVencido();
      }
    });

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

    if (status.indexOf('Inadimplente ') !== -1) {
      return 'bg-danger';
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

      for (let parcela of this.emprestimo.parcelas) {
          let pagouJuros = false;
          let pagouCapital = false;
          for(const pg of parcela.pagamentos) {
              if(pg.juros) {
                  pagouJuros = true;
              } else {
                  pagouCapital = true;
              }
          }
          if(pagouJuros && pagouCapital) {
            receber -= (parcela.valorJuros + parcela.valorParcela)
          }
      }
      this.emprestimo.valorAReceber = receber;
      return null;
    } else {
      let receber = p.valorJuros + p.valorParcela;

      let pagouJuros = false;
      let pagouCapital = false;
      for(const pg of p.pagamentos) {
          if(pg.juros) {
              pagouJuros = true;
          } else {
              pagouCapital = true;
          }
      }
      if(pagouJuros && pagouCapital) {
        receber -= (p.valorJuros + p.valorParcela)
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
    if (e.clienteEmprestimo.inadimplente) {
      e.status = 'Inadimplente';
    }
    for (let p of this.emprestimo.parcelas) {
      this.popularStatusPagamento(p);
    }
    this.displayPagamento = true;
  }

  popularStatusPagamento(parcela: Parcela) {
    let status = 'A Vencer';
    debugger
    if (parcela.pagamentos && parcela.pagamentos.length > 0) {
      let pagouCapital = false;
      let pagouJuros = false;

      for (const pg of parcela.pagamentos) {
        if(pg.juros) {
          pagouJuros = true;
        } else {
          pagouCapital = true;
        }
      }
      if (pagouJuros && pagouCapital) {
        status = 'Pago';
      } else if(pagouJuros) {
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
    let datasIguais = false;
    if (this.pesquisaDataIni === this.pesquisaDataFim) {
      datasIguais = true;
    }

    let dataIni = this.convertToDate(this.pesquisaDataIni ? this.pesquisaDataIni : new Date('1900-01-01'));
    let dataFim = this.convertToDate(this.pesquisaDataFim ? this.pesquisaDataFim : hoje.setFullYear(hoje.getFullYear() + 5));

    if (datasIguais) {
      dataIni.setDate(dataIni.getDate() - 1);
      dataFim.setDate(dataFim.getDate() + 1);
    }

    let lista: EmprestimoDTO[] = [];
    if (this.pesquisaStatus === 'Pago' || this.pesquisaStatus === 'Pago Parcial') {
      lista = this.emprestimos.filter(e =>
        e.emprestimo.parcelas.some(p =>
          p.pagamentos.some(pg =>
            this.convertToDate(pg.dataPagamento) >= dataIni && this.convertToDate(pg.dataPagamento) <= dataFim)));
    } else if (this.pesquisaStatus === 'A Vencer') {
      lista = this.emprestimos.filter(e =>
        e.proximoPgto !== null && this.convertToDate(e.proximoPgto) >= dataIni
        && this.convertToDate(e.proximoPgto) <= dataFim
        && e.status === this.pesquisaStatus);
    } else if (this.pesquisaStatus === '') {
      lista = this.emprestimos;
    } else {
      lista = this.emprestimos.filter(e =>
        e.status.indexOf(this.pesquisaStatus) !== -1);
    }
    this.emprestimos = lista;
  }

  registrarInadimplente(inadimplente: boolean) {
    this.cliente.inadimplente = inadimplente;
    this.clienteService.criarCliente(this.cliente).subscribe(res => {
      this.listarEmprestimos();
      this.notification.showSucesso('Dados gravados com sucesso.');
      this.displayPagamento = false;
    });
  }

}