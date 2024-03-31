import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AbstractForm } from 'src/app/model/abastract-form';
import { Despesa } from 'src/app/model/despesa';
import { EstatisticaDTO } from 'src/app/model/estatistica.dto';
import { FluxoCaixaDTO } from 'src/app/model/fluxo-caixa.dto';
import { EstatisticaService } from 'src/app/service/estatistica.service';

@Component({
  selector: 'app-fluxo-caixa',
  templateUrl: './fluxo-caixa.component.html',
  styleUrls: ['./fluxo-caixa.component.scss']
})
export class FluxoCaixaComponent extends AbstractForm implements OnInit {

  fluxoCaixa: FluxoCaixaDTO = new FluxoCaixaDTO();
  pesquisaDataIni: Date;
  pesquisaDataFim: Date;
  displayDespesa = false;
  despesa: Despesa = new Despesa();
  constructor(private ms: MessageService,
    private estatisticaService: EstatisticaService) {
    super(ms);
  }

  ngOnInit(): void {
    this.estatisticaService.sistemaValido().subscribe(res => {
      if (res) {
        this.inicializarSistema();
      } else {
        this.notification.showSistemaVencido();
      }
    });
  }

  inicializarSistema() {
    this.estatisticaService.obterFluxoCaixa(this.convertToDate('02/01/2024')).subscribe(res => {
      
      this.fluxoCaixa = res;
    });
  }

  showDialogDespesa() {
    this.displayDespesa = true;
    this.despesa = new Despesa();
    this.despesa.data = this.convertDateToString(new Date());
  }

  salvarDespesa() { 
    if(!this.despesa.valor || (this.despesa.valor && this.despesa.valor == 0)) {
      this.notification.showAlerta("O campo valor é obrigatório");
      return ;
    }

    if(!this.despesa.data) {
      this.notification.showAlerta("O campo Data é obrigatório");
      return ;
    }

    this.despesa.data = this.convertToDate(this.despesa.data);

    this.estatisticaService.salvarDespesa(this.despesa).subscribe(res => {
      this.notification.showSucesso("Dados Gravados com sucesso.");
      this.displayDespesa = false;
    });
  }
}
