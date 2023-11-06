import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../pedido.test-samples';

import { PedidoFormService } from './pedido-form.service';

describe('Pedido Form Service', () => {
  let service: PedidoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoFormService);
  });

  describe('Service methods', () => {
    describe('createPedidoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPedidoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dataPedido: expect.any(Object),
            quantidade: expect.any(Object),
            cliente: expect.any(Object),
            produtos: expect.any(Object),
          }),
        );
      });

      it('passing IPedido should create a new form with FormGroup', () => {
        const formGroup = service.createPedidoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dataPedido: expect.any(Object),
            quantidade: expect.any(Object),
            cliente: expect.any(Object),
            produtos: expect.any(Object),
          }),
        );
      });
    });

    describe('getPedido', () => {
      it('should return NewPedido for default Pedido initial value', () => {
        const formGroup = service.createPedidoFormGroup(sampleWithNewData);

        const pedido = service.getPedido(formGroup) as any;

        expect(pedido).toMatchObject(sampleWithNewData);
      });

      it('should return NewPedido for empty Pedido initial value', () => {
        const formGroup = service.createPedidoFormGroup();

        const pedido = service.getPedido(formGroup) as any;

        expect(pedido).toMatchObject({});
      });

      it('should return IPedido', () => {
        const formGroup = service.createPedidoFormGroup(sampleWithRequiredData);

        const pedido = service.getPedido(formGroup) as any;

        expect(pedido).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPedido should not enable id FormControl', () => {
        const formGroup = service.createPedidoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPedido should disable id FormControl', () => {
        const formGroup = service.createPedidoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
