import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { EmprestimosComponent } from './pages/emprestimos/emprestimos.component';
import { FluxoCaixaComponent } from './pages/fluxo-caixa/fluxo-caixa.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'emprestimos', component: EmprestimosComponent },
  { path: 'fluxo-caixa', component: FluxoCaixaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
