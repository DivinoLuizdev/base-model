export class EstatisticaDTO {
    mes: number;
    totalRecebido: number;
    totalSaida: number;
    saldo: number;
    receberMes: number = 0;
    receberGeral: number = 0;
    qtdeClientes: number = 0;
    qtdeEmprestimosAtivos: number = 0;
    qtdeInadimplentes: number = 0;
}