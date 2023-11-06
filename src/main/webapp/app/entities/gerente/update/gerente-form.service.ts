import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGerente, NewGerente } from '../gerente.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGerente for edit and NewGerenteFormGroupInput for create.
 */
type GerenteFormGroupInput = IGerente | PartialWithRequiredKeyOf<NewGerente>;

type GerenteFormDefaults = Pick<NewGerente, 'id'>;

type GerenteFormGroupContent = {
  id: FormControl<IGerente['id'] | NewGerente['id']>;
  nome: FormControl<IGerente['nome']>;
  cpf: FormControl<IGerente['cpf']>;
  salario: FormControl<IGerente['salario']>;
  dataNasc: FormControl<IGerente['dataNasc']>;
};

export type GerenteFormGroup = FormGroup<GerenteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GerenteFormService {
  createGerenteFormGroup(gerente: GerenteFormGroupInput = { id: null }): GerenteFormGroup {
    const gerenteRawValue = {
      ...this.getFormDefaults(),
      ...gerente,
    };
    return new FormGroup<GerenteFormGroupContent>({
      id: new FormControl(
        { value: gerenteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(gerenteRawValue.nome, {
        validators: [Validators.required],
      }),
      cpf: new FormControl(gerenteRawValue.cpf, {
        validators: [Validators.required],
      }),
      salario: new FormControl(gerenteRawValue.salario, {
        validators: [Validators.required],
      }),
      dataNasc: new FormControl(gerenteRawValue.dataNasc, {
        validators: [Validators.required],
      }),
    });
  }

  getGerente(form: GerenteFormGroup): IGerente | NewGerente {
    return form.getRawValue() as IGerente | NewGerente;
  }

  resetForm(form: GerenteFormGroup, gerente: GerenteFormGroupInput): void {
    const gerenteRawValue = { ...this.getFormDefaults(), ...gerente };
    form.reset(
      {
        ...gerenteRawValue,
        id: { value: gerenteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GerenteFormDefaults {
    return {
      id: null,
    };
  }
}
