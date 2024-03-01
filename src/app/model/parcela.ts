import { Pagamento } from "./pagamento";

export class Parcela {
    id: number;
    numParcela: number
    valorParcela: number;
    valorJuros: number;
    dataVencimento: any;
    pagamento: Pagamento;
    dataPagamento: Date;
    valorPago: number;
}