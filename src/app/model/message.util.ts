import { MessageService } from "primeng/api";

export enum TipoMensagem {
    SUCESSO = 'success',
    ALERTA = 'warn',
    INFO = 'info',
    ERRO = 'error'
}

export class MensagemAlerta {
    private service: MessageService;

    constructor(service: MessageService) {
        this.service = service;
    }

    private show(tipo: TipoMensagem, titulo: string, mensagem: string) {
        this.service.add({severity: tipo, summary: titulo, detail: mensagem});
    }

    showSucesso(mensagem: string) {
        this.show(TipoMensagem.SUCESSO, 'Sucesso', mensagem);
    }

    showAlerta(mensagem: string) {
        this.show(TipoMensagem.ALERTA, 'Atenção', mensagem);
    }

    showErro(mensagem: string) {
        this.show(TipoMensagem.ERRO, 'Erro', mensagem);
    }

    showInfo(titulo: string, mensagem: string) {
        this.show(TipoMensagem.INFO, titulo, mensagem);
    }

    showSistemaVencido() {
        this.showErro("Atenção, o período de teste do UnderControl chegou ao fim, por favor, entre em contato com os desenvolvedores para resolver este problema");
    }

}