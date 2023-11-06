import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IGerente } from 'app/entities/gerente/gerente.model';
import { GerenteService } from 'app/entities/gerente/service/gerente.service';
import { IEstoque } from '../estoque.model';
import { EstoqueService } from '../service/estoque.service';
import { EstoqueFormService, EstoqueFormGroup } from './estoque-form.service';

@Component({
  standalone: true,
  selector: 'jhi-estoque-update',
  templateUrl: './estoque-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EstoqueUpdateComponent implements OnInit {
  isSaving = false;
  estoque: IEstoque | null = null;

  gerentesSharedCollection: IGerente[] = [];

  editForm: EstoqueFormGroup = this.estoqueFormService.createEstoqueFormGroup();

  constructor(
    protected estoqueService: EstoqueService,
    protected estoqueFormService: EstoqueFormService,
    protected gerenteService: GerenteService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareGerente = (o1: IGerente | null, o2: IGerente | null): boolean => this.gerenteService.compareGerente(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estoque }) => {
      this.estoque = estoque;
      if (estoque) {
        this.updateForm(estoque);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const estoque = this.estoqueFormService.getEstoque(this.editForm);
    if (estoque.id !== null) {
      this.subscribeToSaveResponse(this.estoqueService.update(estoque));
    } else {
      this.subscribeToSaveResponse(this.estoqueService.create(estoque));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstoque>>): void {
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

  protected updateForm(estoque: IEstoque): void {
    this.estoque = estoque;
    this.estoqueFormService.resetForm(this.editForm, estoque);

    this.gerentesSharedCollection = this.gerenteService.addGerenteToCollectionIfMissing<IGerente>(
      this.gerentesSharedCollection,
      estoque.gerente,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.gerenteService
      .query()
      .pipe(map((res: HttpResponse<IGerente[]>) => res.body ?? []))
      .pipe(map((gerentes: IGerente[]) => this.gerenteService.addGerenteToCollectionIfMissing<IGerente>(gerentes, this.estoque?.gerente)))
      .subscribe((gerentes: IGerente[]) => (this.gerentesSharedCollection = gerentes));
  }
}
