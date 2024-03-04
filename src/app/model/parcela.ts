import { Pagamento } from "./pagamento";

export class Parcela {
    id: number;
    numParcela: number
    valorParcela: number;
    valorJuros: number;
    dataVencimento: any;
    pagamentos: Pagamento[] = [];

    //transient
    statusParcela: string = 'A Vencer';
}