import { AbstractForm } from "./abastract-form";
import { Cliente } from "./cliente";
import { Pagamento } from "./pagamento";
import { Parcela } from "./parcela";
import { StatusEmprestimo } from "./status-emprestimo";

export class Emprestimo {
    id: number;
    valor: number;
    dataEmprestimo: Date = new Date();
    dataInicial: any;
    dataFinal: Date;
    valorTotal: number;
    numeroParcela: number;
    parcelas: Parcela[] = [];
    dataPagamentos: Pagamento[] = [];
    valorJuros: number;
    status: StatusEmprestimo = StatusEmprestimo.PENDENTE;

    //transient
    valorAReceber: number;
}

export class EmprestimoDTO {
    emprestimo: Emprestimo;
    clienteEmprestimo: Cliente; 
    cliente: string;
    status: string;
    valorEmprestado: number;
    valorPago: number;
    saldoDevedor: number;
    proximoPgto: Date;
    isConcluido: boolean;

    constructor(c: Cliente, e: Emprestimo) {
        this.emprestimo = e;
        this.clienteEmprestimo = c;
        this.cliente = `${c.documento.cpf} - ${c.nome}`;
        this.status = this.popularStatusPagamento();
        this.valorEmprestado = e.valor;
        this.valorPago = this.calcularValorPago();
        this.saldoDevedor = e.valorTotal - this.valorPago;
        this.proximoPgto = this.popularProxPagamento();
    }

    private popularStatusPagamento(): string {
        let status = 'A Vencer';
        let contPagos = 0;
        for (let p of this.emprestimo.parcelas) {
            if (p.pagamentos && p.pagamentos.length > 0) {
                let somaPagamento = 0;
                for (const pg of p.pagamentos) {
                    somaPagamento += pg.valorPago;
                }
                if (somaPagamento === p.valorJuros + p.valorParcela) {
                    status = 'Pago';
                    contPagos+=1;
                } else {
                    status = 'Pago Parcial'
                }
            } else if (AbstractForm.convertToDate(p.dataVencimento) < new Date()) {
                return 'Em Atraso'
            } else {
                status = 'A Vencer'
            }
        }
        if(contPagos === this.emprestimo.parcelas.length) {
            status = 'Concluído';
        }
        if(this.clienteEmprestimo.inadimplente) {
            status = `Inadimplente (${status})`;
        }
        return status;
    }

    private calcularValorPago(): number {
        let valor = 0;
        for(let p of this.emprestimo.parcelas) {
            for(let pg of p.pagamentos) {
                valor += pg.valorPago;
            }
        }
        return valor;
    }

    private popularProxPagamento(): Date {
        let data: Date = null;
        const parcelas = this.emprestimo.parcelas.sort(this.compararDatasVencimento);
        for(let p of this.emprestimo.parcelas) {
            if(p.pagamentos && p.pagamentos.length > 0) {
                let valor = 0;
                for(let pg of p.pagamentos) {
                    valor += pg.valorPago;
                }
                if(valor < p.valorJuros + p.valorParcela) {
                    return p.dataVencimento;
                } else {
                    continue;
                }
            }
            return p.dataVencimento;
        }
        return null;
    }

    compararDatasVencimento(a: Parcela, b: Parcela): number {
        // Converte as datas de vencimento para objetos Date
        const dataA = new Date(a.dataVencimento);
        const dataB = new Date(b.dataVencimento);
      
        // Compara as datas
        if (dataA < dataB) {
          return -1; // a vem antes de b
        } else if (dataA > dataB) {
          return 1; // b vem antes de a
        } else {
          return 0; // datas iguais
        }
      }
}