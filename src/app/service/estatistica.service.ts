import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstatisticaDTO } from '../model/estatistica.dto';

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

  sistemaValido(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/api/estatistica/validar-sistema`);
  }
}
