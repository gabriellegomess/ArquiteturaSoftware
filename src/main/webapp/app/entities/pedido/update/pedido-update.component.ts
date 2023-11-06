import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { IProduto } from 'app/entities/produto/produto.model';
import { ProdutoService } from 'app/entities/produto/service/produto.service';
import { PedidoService } from '../service/pedido.service';
import { IPedido } from '../pedido.model';
import { PedidoFormService, PedidoFormGroup } from './pedido-form.service';

@Component({
  standalone: true,
  selector: 'jhi-pedido-update',
  templateUrl: './pedido-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PedidoUpdateComponent implements OnInit {
  isSaving = false;
  pedido: IPedido | null = null;

  clientesSharedCollection: ICliente[] = [];
  produtosSharedCollection: IProduto[] = [];

  editForm: PedidoFormGroup = this.pedidoFormService.createPedidoFormGroup();

  constructor(
    protected pedidoService: PedidoService,
    protected pedidoFormService: PedidoFormService,
    protected clienteService: ClienteService,
    protected produtoService: ProdutoService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareCliente = (o1: ICliente | null, o2: ICliente | null): boolean => this.clienteService.compareCliente(o1, o2);

  compareProduto = (o1: IProduto | null, o2: IProduto | null): boolean => this.produtoService.compareProduto(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pedido }) => {
      this.pedido = pedido;
      if (pedido) {
        this.updateForm(pedido);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pedido = this.pedidoFormService.getPedido(this.editForm);
    if (pedido.id !== null) {
      this.subscribeToSaveResponse(this.pedidoService.update(pedido));
    } else {
      this.subscribeToSaveResponse(this.pedidoService.create(pedido));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPedido>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(pedido: IPedido): void {
    this.pedido = pedido;
    this.pedidoFormService.resetForm(this.editForm, pedido);

    this.clientesSharedCollection = this.clienteService.addClienteToCollectionIfMissing<ICliente>(
      this.clientesSharedCollection,
      pedido.cliente,
    );
    this.produtosSharedCollection = this.produtoService.addProdutoToCollectionIfMissing<IProduto>(
      this.produtosSharedCollection,
      ...(pedido.produtos ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.clienteService
      .query()
      .pipe(map((res: HttpResponse<ICliente[]>) => res.body ?? []))
      .pipe(map((clientes: ICliente[]) => this.clienteService.addClienteToCollectionIfMissing<ICliente>(clientes, this.pedido?.cliente)))
      .subscribe((clientes: ICliente[]) => (this.clientesSharedCollection = clientes));

    this.produtoService
      .query()
      .pipe(map((res: HttpResponse<IProduto[]>) => res.body ?? []))
      .pipe(
        map((produtos: IProduto[]) =>
          this.produtoService.addProdutoToCollectionIfMissing<IProduto>(produtos, ...(this.pedido?.produtos ?? [])),
        ),
      )
      .subscribe((produtos: IProduto[]) => (this.produtosSharedCollection = produtos));
  }
}
