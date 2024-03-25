import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AbstractForm } from 'src/app/model/abastract-form';
import { EstatisticaDTO } from 'src/app/model/estatistica.dto';
import { EstatisticaService } from 'src/app/service/estatistica.service';

@Component({
  selector: 'app-fluxo-caixa',
  templateUrl: './fluxo-caixa.component.html',
  styleUrls: ['./fluxo-caixa.component.scss']
})
export class FluxoCaixaComponent extends AbstractForm implements OnInit {

  hoje: Date;
  mes: string;
  estatistica: EstatisticaDTO;
  historico: EstatisticaDTO[] = [];
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
    this.hoje = new Date();
    this.mes = this.hoje.toLocaleDateString('pt-BR', { month: 'long' });
    this.mes = this.mes.charAt(0).toUpperCase() + this.mes.slice(1);

    this.estatisticaService.obterEstatisticaDoMes().subscribe(res => {
      this.estatistica = res;
    });

    this.estatisticaService.obterHistoricoEstatistica().subscribe(res => {
      this.historico = res;
    });
  }
}
