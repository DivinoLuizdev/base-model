import { Endereco } from './endereco';
import { Documento } from './documento';
import { Contato  } from './contato';
 
export class Cliente {

  

    constructor(
        public id?: number,
        public nome?: string,
        public estadoCivil: string = '',
        public nomeConjuge: string = '',
        public observacao: string = '',
        public documento: Documento = new Documento(),
        public endereco: Endereco = new Endereco(),
        public contato: Contato = new Contato(),
        public localTrabalho: Endereco | any = new Endereco()
      ) {}
}
