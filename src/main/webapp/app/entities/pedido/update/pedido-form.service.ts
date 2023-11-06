import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPedido, NewPedido } from '../pedido.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPedido for edit and NewPedidoFormGroupInput for create.
 */
type PedidoFormGroupInput = IPedido | PartialWithRequiredKeyOf<NewPedido>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPedido | NewPedido> = Omit<T, 'dataPedido'> & {
  dataPedido?: string | null;
};

type PedidoFormRawValue = FormValueOf<IPedido>;

type NewPedidoFormRawValue = FormValueOf<NewPedido>;

type PedidoFormDefaults = Pick<NewPedido, 'id' | 'dataPedido' | 'produtos'>;

type PedidoFormGroupContent = {
  id: FormControl<PedidoFormRawValue['id'] | NewPedido['id']>;
  dataPedido: FormControl<PedidoFormRawValue['dataPedido']>;
  quantidade: FormControl<PedidoFormRawValue['quantidade']>;
  cliente: FormControl<PedidoFormRawValue['cliente']>;
  produtos: FormControl<PedidoFormRawValue['produtos']>;
};

export type PedidoFormGroup = FormGroup<PedidoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PedidoFormService {
  createPedidoFormGroup(pedido: PedidoFormGroupInput = { id: null }): PedidoFormGroup {
    const pedidoRawValue = this.convertPedidoToPedidoRawValue({
      ...this.getFormDefaults(),
      ...pedido,
    });
    return new FormGroup<PedidoFormGroupContent>({
      id: new FormControl(
        { value: pedidoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      dataPedido: new FormControl(pedidoRawValue.dataPedido, {
        validators: [Validators.required],
      }),
      quantidade: new FormControl(pedidoRawValue.quantidade, {
        validators: [Validators.required],
      }),
      cliente: new FormControl(pedidoRawValue.cliente),
      produtos: new FormControl(pedidoRawValue.produtos ?? []),
    });
  }

  getPedido(form: PedidoFormGroup): IPedido | NewPedido {
    return this.convertPedidoRawValueToPedido(form.getRawValue() as PedidoFormRawValue | NewPedidoFormRawValue);
  }

  resetForm(form: PedidoFormGroup, pedido: PedidoFormGroupInput): void {
    const pedidoRawValue = this.convertPedidoToPedidoRawValue({ ...this.getFormDefaults(), ...pedido });
    form.reset(
      {
        ...pedidoRawValue,
        id: { value: pedidoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PedidoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dataPedido: currentTime,
      produtos: [],
    };
  }

  private convertPedidoRawValueToPedido(rawPedido: PedidoFormRawValue | NewPedidoFormRawValue): IPedido | NewPedido {
    return {
      ...rawPedido,
      dataPedido: dayjs(rawPedido.dataPedido, DATE_TIME_FORMAT),
    };
  }

  private convertPedidoToPedidoRawValue(
    pedido: IPedido | (Partial<NewPedido> & PedidoFormDefaults),
  ): PedidoFormRawValue | PartialWithRequiredKeyOf<NewPedidoFormRawValue> {
    return {
      ...pedido,
      dataPedido: pedido.dataPedido ? pedido.dataPedido.format(DATE_TIME_FORMAT) : undefined,
      produtos: pedido.produtos ?? [],
    };
  }
}
