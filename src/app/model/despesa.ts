export class Despesa {
    id: number;
    valor: number;
    data: Date;
    descricao: string;

    constructor() {
        this.data = new Date();
    }
}