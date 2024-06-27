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
    idEmprestimo: number;
    isPagamentoJuros = false;
    isPago: boolean;
    dtPgto: any;

    static getIsPago(parcela: Parcela): boolean {
        debugger
        let somaCapital = 0;
        let pagoJuros = false;
        if(parcela.pagamentos) {
            for(const pg of parcela.pagamentos) {
                if(pg.juros) {
                    pagoJuros = true;
                } else {
                    somaCapital += pg.valorPago;
                }
            }
        }
        return somaCapital >= parcela.valorParcela && pagoJuros;
    }
}