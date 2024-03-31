import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstatisticaDTO } from '../model/estatistica.dto';
import { FluxoCaixaDTO } from '../model/fluxo-caixa.dto';
import { Despesa } from '../model/despesa';

@Injectable({
  providedIn: 'root'
})
export class EstatisticaService {

  private apiUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  obterEstatistica(): Observable<EstatisticaDTO> {
    return this.http.get<EstatisticaDTO>(`${this.apiUrl}/api/estatistica`);
  }

  obterHistoricoEstatistica(): Observable<EstatisticaDTO[]> {
    return this.http.get<EstatisticaDTO[]>(`${this.apiUrl}/api/estatistica/historico`);
  }

  obterFluxoCaixa(dataIni: Date, dataFim: Date): Observable<FluxoCaixaDTO[]> {
    return this.http.get<FluxoCaixaDTO[]>(`${this.apiUrl}/api/estatistica/fluxo-caixa/${dataIni}/${dataFim}`);
  }

  sistemaValido(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/api/estatistica/validar-sistema`);
  }

  salvarDespesa(despesa: Despesa): Observable<any> {
    return this.http.post<Despesa>(`${this.apiUrl}/api/despesa`, despesa);
  }
}
