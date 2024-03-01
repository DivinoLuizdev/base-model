import { Pagamento } from "./pagamento";

export class Parcela {
    id: number;
    numParcela: number
    valorParcela: number;
    valorJuros: number;
    dataVencimento: Date;
    pagamento: Pagamento;
    dataPagamento: Date;
    valorPago: number;
}