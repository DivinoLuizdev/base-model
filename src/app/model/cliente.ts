import { Endereco } from './endereco';
import { Documento } from './documento';
import { Contato  } from './contato';
import {EstadoCivil} from './estado-civil'
import { Emprestimo } from './emprestimo';

export class Cliente {
  id: number;
  nome: string;
  estadoCivil: EstadoCivil;
  nomeConjuge: string;
  observacao: string;
  documento: Documento = new Documento;
  endereco: Endereco = new Endereco();
  contato: Contato = new Contato();
  localTrabalho: Endereco = new Endereco();
  emprestimos: Emprestimo[] = [];
  inadimplente: boolean = false;

  //transient
  statusEmprestimo: string;
  constructor() {}
}