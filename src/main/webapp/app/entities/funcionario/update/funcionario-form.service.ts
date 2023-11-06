import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFuncionario, NewFuncionario } from '../funcionario.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFuncionario for edit and NewFuncionarioFormGroupInput for create.
 */
type FuncionarioFormGroupInput = IFuncionario | PartialWithRequiredKeyOf<NewFuncionario>;

type FuncionarioFormDefaults = Pick<NewFuncionario, 'id'>;

type FuncionarioFormGroupContent = {
  id: FormControl<IFuncionario['id'] | NewFuncionario['id']>;
  nome: FormControl<IFuncionario['nome']>;
  cpf: FormControl<IFuncionario['cpf']>;
  salario: FormControl<IFuncionario['salario']>;
  dataNasc: FormControl<IFuncionario['dataNasc']>;
  gerente: FormControl<IFuncionario['gerente']>;
};

export type FuncionarioFormGroup = FormGroup<FuncionarioFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FuncionarioFormService {
  createFuncionarioFormGroup(funcionario: FuncionarioFormGroupInput = { id: null }): FuncionarioFormGroup {
    const funcionarioRawValue = {
      ...this.getFormDefaults(),
      ...funcionario,
    };
    return new FormGroup<FuncionarioFormGroupContent>({
      id: new FormControl(
        { value: funcionarioRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(funcionarioRawValue.nome, {
        validators: [Validators.required],
      }),
      cpf: new FormControl(funcionarioRawValue.cpf, {
        validators: [Validators.required],
      }),
      salario: new FormControl(funcionarioRawValue.salario, {
        validators: [Validators.required],
      }),
      dataNasc: new FormControl(funcionarioRawValue.dataNasc, {
        validators: [Validators.required],
      }),
      gerente: new FormControl(funcionarioRawValue.gerente),
    });
  }

  getFuncionario(form: FuncionarioFormGroup): IFuncionario | NewFuncionario {
    return form.getRawValue() as IFuncionario | NewFuncionario;
  }

  resetForm(form: FuncionarioFormGroup, funcionario: FuncionarioFormGroupInput): void {
    const funcionarioRawValue = { ...this.getFormDefaults(), ...funcionario };
    form.reset(
      {
        ...funcionarioRawValue,
        id: { value: funcionarioRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): FuncionarioFormDefaults {
    return {
      id: null,
    };
  }
}
