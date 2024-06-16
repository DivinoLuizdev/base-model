import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AbstractForm } from 'src/app/model/abastract-form';
import { Despesa } from 'src/app/model/despesa';
import { FluxoCaixaDTO, ItemFluxoCaixaDTO } from 'src/app/model/fluxo-caixa.dto';
import { EstatisticaService } from 'src/app/service/estatistica.service';

@Component({
  selector: 'app-fluxo-caixa',
  templateUrl: './fluxo-caixa.component.html',
  styleUrls: ['./fluxo-caixa.component.scss']
})
export class FluxoCaixaComponent extends AbstractForm implements OnInit {

  fluxoCaixa: FluxoCaixaDTO[] = [];
  pesquisaDataIni: Date;
  pesquisaDataFim: Date;
  displayDespesa = false;
  displayParcela = false
  despesa: Despesa = new Despesa();
  vencido = false;
  selected: ItemFluxoCaixaDTO = new ItemFluxoCaixaDTO();

  totalJuros = 0;
  totalCapital = 0;
  totalEmprestimo = 0;
  totalDespesas = 0;
  constructor(private ms: MessageService,
    private estatisticaService: EstatisticaService) {
    super(ms);
  }

  ngOnInit(): void {
    this.estatisticaService.sistemaValido().subscribe(res => {
      if (res) {
        this.vencido = false;
      } else {
        this.notification.showSistemaVencido();
        this.vencido = true;
      }
    });
  }

  showDialogDespesa() {
    this.displayDespesa = true;
    this.despesa = new Despesa();
    this.despesa.data = this.convertDateToString(new Date());
  }

  salvarDespesa() {
    if (!this.despesa.valor || (this.despesa.valor && this.despesa.valor == 0)) {
      this.notification.showAlerta("O campo valor é obrigatório");
      return;
    }

    if (!this.despesa.data) {
      this.notification.showAlerta("O campo Data é obrigatório");
      return;
    }

    this.despesa.data = this.convertToDate(this.despesa.data);

    this.estatisticaService.salvarDespesa(this.despesa).subscribe(res => {
      this.notification.showSucesso("Dados Gravados com sucesso.");
      this.displayDespesa = false;
    });
  }

  calcularFluxoCaixa() {
    if (this.vencido) {
      this.notification.showSistemaVencido();
      return;
    }

    if (!this.pesquisaDataIni || !this.pesquisaDataFim) {
      this.notification.showAlerta("Data de Início e Fim da Pesquisa são obrigatórias.");
      return;
    }

    const dataIni = this.convertToDate(this.pesquisaDataIni);
    const dataFim = this.convertToDate(this.pesquisaDataFim);

    if (dataIni > dataFim) {
      this.notification.showAlerta("A data de início não pode ser maior que a data fim");
      return;
    }

    this.estatisticaService.obterFluxoCaixa(dataIni, dataFim).subscribe((res: FluxoCaixaDTO[]) => {
      if (res.length === 0) {
        this.notification.showAlerta('Nenhum registro encontrato para o período informado.');
      } else {
        this.calcularTotalGeral(res);
      }
      this.fluxoCaixa = res;
    });
  }

  calcularTotalGeral(fluxosCaixa: FluxoCaixaDTO[]) {
    this.totalJuros = 0;
    this.totalCapital = 0;
    this.totalEmprestimo = 0;
    this.totalDespesas = 0;
    for (const fluxo of fluxosCaixa) {
      this.totalJuros += fluxo.totalJuros;
      this.totalCapital += fluxo.totalParcela;
      this.totalEmprestimo += fluxo.totalEmprestimos;
      this.totalDespesas += fluxo.totalDespesas;
    }
  }

  showParcela(item: ItemFluxoCaixaDTO) {
    this.selected = item;
    this.displayParcela = true;
  }
}
