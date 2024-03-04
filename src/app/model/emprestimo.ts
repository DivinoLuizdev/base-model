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