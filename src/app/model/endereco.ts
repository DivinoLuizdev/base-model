import {Estados} from './estados'
export class Endereco {
  constructor(
    public id: number = 0,
    public rua: string = '',
    public cidade: string = '',
    public cep: string = '',
    public estado: Estados = Estados.Goiás ,
    public numero: number = 0,
    public complemento: string = '',
    public bairro: string = ''
  ) {}
}
