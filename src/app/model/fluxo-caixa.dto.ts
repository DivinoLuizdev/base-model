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
    data: Date;
    pagoJuros: number;
    pagoParcela: number;
    valorDebito: number;
}