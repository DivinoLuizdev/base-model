import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { EmprestimosComponent } from './pages/emprestimos/emprestimos.component';
import { RelatorioComponent } from './pages/relatorio/relatorio.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { CalendarioComponent } from './pages/calendario/calendario.component';

const routes: Routes = [
{ path: '', component: MainComponent },
{ path: 'clientes', component: ClientesComponent },
{ path: 'emprestimos', component: EmprestimosComponent },
{ path: 'usuario', component: UsuarioComponent },
{ path: 'calendario', component: CalendarioComponent },
{ path: 'relatorio', component: RelatorioComponent },
// Adicione mais rotas conforme necessário
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
