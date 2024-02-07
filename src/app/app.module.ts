import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { SiderbarComponent } from './components/siderbar/siderbar.component';
import { CardComponent } from './components/card/card.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { EmprestimosComponent } from './pages/emprestimos/emprestimos.component';
import { ChartModule } from 'primeng/chart';
import { CadastroClientesComponent } from './components/cadastro-clientes/cadastro-clientes.component';
import { InputMaskModule } from 'primeng/inputmask';





@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SiderbarComponent,
    CardComponent,
    NavBarComponent,
    ClientesComponent,
    EmprestimosComponent,
    CadastroClientesComponent,
  ],
  imports: [
    
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    SidebarModule,
    ButtonModule,
    BrowserAnimationsModule,
    PanelModule,
    CardModule,
    FormsModule,
    DropdownModule,
    HttpClientModule,
    TableModule,
    ChartModule,
    InputMaskModule
   
  ],
  exports: [],

  providers: [],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
