import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IGerente } from '../gerente.model';
import { GerenteService } from '../service/gerente.service';
import { GerenteFormService, GerenteFormGroup } from './gerente-form.service';

@Component({
  standalone: true,
  selector: 'jhi-gerente-update',
  templateUrl: './gerente-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GerenteUpdateComponent implements OnInit {
  isSaving = false;
  gerente: IGerente | null = null;

  editForm: GerenteFormGroup = this.gerenteFormService.createGerenteFormGroup();

  constructor(
    protected gerenteService: GerenteService,
    protected gerenteFormService: GerenteFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gerente }) => {
      this.gerente = gerente;
      if (gerente) {
        this.updateForm(gerente);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gerente = this.gerenteFormService.getGerente(this.editForm);
    if (gerente.id !== null) {
      this.subscribeToSaveResponse(this.gerenteService.update(gerente));
    } else {
      this.subscribeToSaveResponse(this.gerenteService.create(gerente));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGerente>>): void {
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

  protected updateForm(gerente: IGerente): void {
    this.gerente = gerente;
    this.gerenteFormService.resetForm(this.editForm, gerente);
  }
}
