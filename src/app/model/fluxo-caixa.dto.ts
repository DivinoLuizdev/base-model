import { Parcela } from "./parcela";

export class FluxoCaixaDTO {
    dataRef: Date;
    totalParcela: number;
    totalJuros: number;
    totalDespesas: number;
    totalEmprestimos: number;
    itens: ItemFluxoCaixaDTO[] = [];
}

export class ItemFluxoCaixaDTO {
    id: number;
    identificacao: string;
    dataEmprestimo: Date;
    dataPagamento: Date;
    dataVencimento: Date;
    pagoJuros: number;
    pagoParcela: number;
    valorDebito: number;
    parcela: Parcela = new Parcela();
}