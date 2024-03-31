export class Despesa {
    id: number;
    valor: number;
    data: any;
    descricao: string;

    constructor() {
        this.data = new Date();
    }
}