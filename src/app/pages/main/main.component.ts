import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AbstractForm } from 'src/app/model/abastract-form';
import { EstatisticaDTO } from 'src/app/model/estatistica.dto';
import { EstatisticaService } from 'src/app/service/estatistica.service';



@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})

//LOGICA PARA EXIBIR O GRAFICO 'AreaChart' do AdminLTE 

export class MainComponent extends AbstractForm implements OnInit {
    data: any;
    options: any;
    card: EstatisticaDTO = new EstatisticaDTO();
    hoje: Date = new Date();
    constructor(private estatisticaService: EstatisticaService,
        private msg: MessageService) {
            super(msg);
    }

    ngOnInit() {
        this.estatisticaService.sistemaValido().subscribe(res => {
            if(res) {
                this.inicializarSistema();
            } else {
                this.notification.showSistemaVencido();
            }
        });
        
    }

    inicializarSistema() {
        this.carregarCards();
        let historico: EstatisticaDTO[] = [];
        this.estatisticaService.obterHistoricoEstatistica().subscribe(res => {
            historico = res;
            this.estatisticaService.obterEstatisticaDoMes().subscribe(res => {
                historico.push(res);
                this.preencherGrafico(historico);
            });
        });
    }

    carregarCards() {
        this.estatisticaService.obterEstatisticaHome().subscribe(res => {
            this.card = res;
        });
    }

    preencherGrafico(historico: EstatisticaDTO[]) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        debugger;
        let meses = [];
        let totalRecebido = [];
        let totalSaida = [];
        let saldo = [];
        for(const h of historico) {
            meses.push(this.getMesExtenso(h.mes));
            totalRecebido.push(h.totalRecebido);
            totalSaida.push(h.totalSaida);
            saldo.push(h.saldo);
        }

        this.data = {
            labels: meses,
            datasets: [
                {
                    label: 'Total Recebido',
                    data: totalRecebido,
                    fill: false,
                    tension: 0.4,
                    borderColor: documentStyle.getPropertyValue('--blue-500')
                },
                {
                    label: 'Total Saída',
                    data: totalSaida,
                    fill: false,
                    //   borderDash: [5, 5],
                    tension: 0.4,
                    //   borderColor: documentStyle.getPropertyValue('--teal-500'),
                    backgroundColor: 'rgb(33, 146, 193)'
                },
                {
                    label: 'Saldo',
                    data: saldo,
                    fill: false,
                    //   borderColor: documentStyle.getPropertyValue('#D0D4DE'),
                    tension: 0.4,
                    backgroundColor: '#D1D5DE80'
                }
            ]
        };

        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };
    }
}