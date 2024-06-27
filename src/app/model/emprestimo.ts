import { AbstractForm } from "./abastract-form";
import { Cliente } from "./cliente";
import { Pagamento } from "./pagamento";
import { Parcela } from "./parcela";
import { StatusEmprestimo } from "./status-emprestimo";

export class Emprestimo {
    id: number;
    valor: number;
    dataEmprestimo: any = new Date();
    dataInicial: any;
    dataFinal: Date;
    valorTotal: number;
    numeroParcela: number;
    parcelas: Parcela[] = [];
    dataPagamentos: Pagamento[] = [];
    valorJuros: number;
    status: StatusEmprestimo = StatusEmprestimo.PENDENTE;
    observacao: string;

    //transient
    valorAReceber: number;
    editing = false;
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
        if (e.observacao) {
            this.cliente += ` [${e.observacao}]`
        }
        this.status = this.popularStatusPagamento();
        this.valorEmprestado = e.valor;
        this.valorPago = this.calcularValorPago();
        this.saldoDevedor = this.calcularSaldoDevedor();
        this.proximoPgto = this.popularProxPagamento();
    }

    private calcularSaldoDevedor(): number {
        let saldo = this.emprestimo.valorTotal
        for (const parcela of this.emprestimo.parcelas) {
            let pagouJuros = false;
            let pagouCapital = false;
            for (const pg of parcela.pagamentos) {
                if (pg.juros) {
                    pagouJuros = true;
                } else {
                    pagouCapital = true;
                }
            }
            if (pagouJuros && pagouCapital) {
                saldo -= (parcela.valorJuros + parcela.valorParcela)
            }
        }
        return saldo;
    }

    private popularStatusPagamento(): string {
        let status = 'A Vencer';
        let contPagos = 0;
        for (let p of this.emprestimo.parcelas) {
            if (p.pagamentos && p.pagamentos.length > 0) {
                let pagouCapital = false;
                let pagouJuros = false;

                for (const pg of p.pagamentos) {
                    if (pg.juros) {
                        pagouJuros = true;
                    } else {
                        pagouCapital = true;
                    }
                }
                if (pagouJuros && pagouCapital) {
                    status = 'Pago';
                    contPagos += 1;
                } else if (pagouJuros) {
                    status = 'Pago Parcial'
                }

            } else if (AbstractForm.convertToDate(p.dataVencimento) < new Date()) {
                return 'Em Atraso'
            } else {
                status = 'A Vencer'
            }
        }
        if (contPagos === this.emprestimo.parcelas.length) {
            status = 'Concluído';
        }
        if (this.clienteEmprestimo.inadimplente) {
            status = `Inadimplente (${status})`;
        }
        return status;
    }

    private calcularValorPago(): number {
        let valor = 0;
        for (let p of this.emprestimo.parcelas) {
            for (let pg of p.pagamentos) {
                valor += pg.valorPago;
            }
        }
        return valor;
    }

    private popularProxPagamento(): Date {
        let data: Date = null;
        const parcelas = this.emprestimo.parcelas.sort(this.compararDatasVencimento);
        for (let p of this.emprestimo.parcelas) {
            if (p.pagamentos && p.pagamentos.length > 0) {
                let valor = 0;
                for (let pg of p.pagamentos) {
                    valor += pg.valorPago;
                }
                if (valor < p.valorJuros + p.valorParcela) {
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