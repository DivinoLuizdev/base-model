import { Pagamento } from "./pagamento";

export class Parcela {
    id: number;
    valorParcela: number;
    dataVencimento: number;
    pagamento: Pagamento;
    dataPagamento: Date;
    valorPago: number;
}