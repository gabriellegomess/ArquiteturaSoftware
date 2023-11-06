import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IGerente } from 'app/entities/gerente/gerente.model';
import { GerenteService } from 'app/entities/gerente/service/gerente.service';
import { IFuncionario } from '../funcionario.model';
import { FuncionarioService } from '../service/funcionario.service';
import { FuncionarioFormService, FuncionarioFormGroup } from './funcionario-form.service';

@Component({
  standalone: true,
  selector: 'jhi-funcionario-update',
  templateUrl: './funcionario-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class FuncionarioUpdateComponent implements OnInit {
  isSaving = false;
  funcionario: IFuncionario | null = null;

  gerentesSharedCollection: IGerente[] = [];

  editForm: FuncionarioFormGroup = this.funcionarioFormService.createFuncionarioFormGroup();

  constructor(
    protected funcionarioService: FuncionarioService,
    protected funcionarioFormService: FuncionarioFormService,
    protected gerenteService: GerenteService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareGerente = (o1: IGerente | null, o2: IGerente | null): boolean => this.gerenteService.compareGerente(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ funcionario }) => {
      this.funcionario = funcionario;
      if (funcionario) {
        this.updateForm(funcionario);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const funcionario = this.funcionarioFormService.getFuncionario(this.editForm);
    if (funcionario.id !== null) {
      this.subscribeToSaveResponse(this.funcionarioService.update(funcionario));
    } else {
      this.subscribeToSaveResponse(this.funcionarioService.create(funcionario));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFuncionario>>): void {
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

  protected updateForm(funcionario: IFuncionario): void {
    this.funcionario = funcionario;
    this.funcionarioFormService.resetForm(this.editForm, funcionario);

    this.gerentesSharedCollection = this.gerenteService.addGerenteToCollectionIfMissing<IGerente>(
      this.gerentesSharedCollection,
      funcionario.gerente,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.gerenteService
      .query()
      .pipe(map((res: HttpResponse<IGerente[]>) => res.body ?? []))
      .pipe(
        map((gerentes: IGerente[]) => this.gerenteService.addGerenteToCollectionIfMissing<IGerente>(gerentes, this.funcionario?.gerente)),
      )
      .subscribe((gerentes: IGerente[]) => (this.gerentesSharedCollection = gerentes));
  }
}
