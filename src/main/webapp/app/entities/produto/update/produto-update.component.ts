import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEstoque } from 'app/entities/estoque/estoque.model';
import { EstoqueService } from 'app/entities/estoque/service/estoque.service';
import { IProduto } from '../produto.model';
import { ProdutoService } from '../service/produto.service';
import { ProdutoFormService, ProdutoFormGroup } from './produto-form.service';

@Component({
  standalone: true,
  selector: 'jhi-produto-update',
  templateUrl: './produto-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProdutoUpdateComponent implements OnInit {
  isSaving = false;
  produto: IProduto | null = null;

  estoquesSharedCollection: IEstoque[] = [];

  editForm: ProdutoFormGroup = this.produtoFormService.createProdutoFormGroup();

  constructor(
    protected produtoService: ProdutoService,
    protected produtoFormService: ProdutoFormService,
    protected estoqueService: EstoqueService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareEstoque = (o1: IEstoque | null, o2: IEstoque | null): boolean => this.estoqueService.compareEstoque(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ produto }) => {
      this.produto = produto;
      if (produto) {
        this.updateForm(produto);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const produto = this.produtoFormService.getProduto(this.editForm);
    if (produto.id !== null) {
      this.subscribeToSaveResponse(this.produtoService.update(produto));
    } else {
      this.subscribeToSaveResponse(this.produtoService.create(produto));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduto>>): void {
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

  protected updateForm(produto: IProduto): void {
    this.produto = produto;
    this.produtoFormService.resetForm(this.editForm, produto);

    this.estoquesSharedCollection = this.estoqueService.addEstoqueToCollectionIfMissing<IEstoque>(
      this.estoquesSharedCollection,
      produto.estoque,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.estoqueService
      .query()
      .pipe(map((res: HttpResponse<IEstoque[]>) => res.body ?? []))
      .pipe(map((estoques: IEstoque[]) => this.estoqueService.addEstoqueToCollectionIfMissing<IEstoque>(estoques, this.produto?.estoque)))
      .subscribe((estoques: IEstoque[]) => (this.estoquesSharedCollection = estoques));
  }
}
