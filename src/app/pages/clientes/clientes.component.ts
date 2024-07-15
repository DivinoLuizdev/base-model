import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractForm } from 'src/app/model/abastract-form';
import { Cliente } from 'src/app/model/cliente';
import { ClienteService } from 'src/app/service/cliente.service';
import { EstatisticaService } from 'src/app/service/estatistica.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent extends AbstractForm implements OnInit {
  clientes: Cliente[] = [];
  clienteSelecionado = new Cliente();
  displayCadastro = false;
  isCrediario = false;
  tituloPopup = 'Cadastro';

  constructor(private clienteService: ClienteService,
    private ms: MessageService,
    private estatisticaService: EstatisticaService,
    private confirmService: ConfirmationService) {
    super(ms);
  }

  ngOnInit(): void {
    this.estatisticaService.sistemaValido().subscribe(res => {
      if (res) {
        this.carregarClientes();
      } else {
        this.notification.showSistemaVencido();
      }
    });
  }

  filtrar(filtro: string) {
    this.clienteService.listaClientes().subscribe(res => {
      if (res && res.length > 0) {
        if (this.isCpf(filtro)) {
          this.filtrarPorCpf(filtro.trim(), res);
          return;
        }

        if (this.isNumber(filtro)) {
          this.filtrarPorId(filtro, res);
          return;
        }
        this.filtrarPorNome(filtro, res);
      }
    }, error => {
      this.notification.showErro('Erro ao carregar lista de clientes');
    });
  }

  filtrarPorCpf(filtro: string, lista: Cliente[]) {
    this.clientes = lista.filter(cliente => cliente.documento.cpf === filtro);
  }

  filtrarPorId(filtro: string, lista: Cliente[]) {
    const id = Number(filtro);
    this.clientes = lista.filter(cliente => cliente.id === id);
  }

  filtrarPorNome(filtro: string, lista: Cliente[]) {
    this.clientes = lista.filter(cliente => cliente.nome.toLowerCase().includes(filtro.toLowerCase()));
  }

  carregarClientes() {
    this.clienteService.listaClientes().subscribe(res => {
      this.clientes = res;
    }, error => {
      this.notification.showErro('Erro ao carregar lista de clientes');
    });
  }

  excluirCliente(id: number) {
    this.confirmService.confirm({
      message: 'Tem certeza que deseja excluir este registro?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deletarCliente(id);
      }
    });
  }

  async deletarCliente(id: number): Promise<void> {
  try {
      await this.clienteService.deletarCliente(id).toPromise();
      this.clientes = this.clientes.filter((cliente) => cliente.id !== id);
      this.notification.showSucesso('Cliente excluído com sucesso.');
    } catch (error) {
      this.notification.showErro(`Erro ao excluir cliente ${id}: ${error}`);
    }
  }

  showDialogCadastro() {
    this.clienteSelecionado = new Cliente();
    this.isCrediario = false;
    this.tituloPopup = 'Cadastro Cliente';
    this.displayCadastro = true;
  }

  showDialogEdit(cliente: Cliente, isCrediario: boolean) {
    this.clienteSelecionado = cliente;
    this.isCrediario = isCrediario;
    this.tituloPopup = isCrediario ? 'Gerenciar Crediário' : 'Editar Cliente';
    this.displayCadastro = true;
  }

  afterSave(cliente: Cliente) {
    this.carregarClientes();
    this.displayCadastro = false;
  }
}
