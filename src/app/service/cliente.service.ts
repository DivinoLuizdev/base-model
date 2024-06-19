import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Cliente } from '../model/cliente';
import { Parcela } from '../model/parcela';
import { Emprestimo } from '../model/emprestimo';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  listaClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/api/cliente`);
  }

  listarPorCpf(cpf: String): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/api/cliente/cpf/${cpf}`)
  }

  criarCliente(cliente: any): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/api/cliente`,cliente, { headers });
  }

  atualizarCliente(id: number, cliente:Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/api/cliente/${id}`, cliente);
  }

  deletarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/cliente/${id}`);
  }

  deletarEmprestimo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/emprestimo/${id}`);
  }

  registrarPagamento(parcela: Parcela): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<string>(`${this.apiUrl}/api/emprestimo/pagamento`,parcela, { 
      headers : headers,
      responseType: 'text' as 'json'
    });
  }

  quitarFinanciamnento(emprestimo: Emprestimo): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<string>(`${this.apiUrl}/api/emprestimo/quitar`,emprestimo, { 
      headers : headers,
      responseType: 'text' as 'json'
    });
  }
}
