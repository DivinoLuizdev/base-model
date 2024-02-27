import { Pagamento } from "./pagamento";
import { Parcela } from "./parcela";
import { StatusEmprestimo } from "./status-emprestimo";

export class Emprestimo {
    id: number;
    valor: number;
    dataInicial: Date;
    dataFinal: Date;
    valorTotal: number;
    numeroParcela: number;
    parcelas: Parcela[] = [];
    dataPagamentos: Pagamento[] = [];
    valorJuros: number;
    status: StatusEmprestimo;
}