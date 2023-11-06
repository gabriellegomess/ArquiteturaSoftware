import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../estoque.test-samples';

import { EstoqueFormService } from './estoque-form.service';

describe('Estoque Form Service', () => {
  let service: EstoqueFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstoqueFormService);
  });

  describe('Service methods', () => {
    describe('createEstoqueFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEstoqueFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            qtde: expect.any(Object),
            gerente: expect.any(Object),
          }),
        );
      });

      it('passing IEstoque should create a new form with FormGroup', () => {
        const formGroup = service.createEstoqueFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            qtde: expect.any(Object),
            gerente: expect.any(Object),
          }),
        );
      });
    });

    describe('getEstoque', () => {
      it('should return NewEstoque for default Estoque initial value', () => {
        const formGroup = service.createEstoqueFormGroup(sampleWithNewData);

        const estoque = service.getEstoque(formGroup) as any;

        expect(estoque).toMatchObject(sampleWithNewData);
      });

      it('should return NewEstoque for empty Estoque initial value', () => {
        const formGroup = service.createEstoqueFormGroup();

        const estoque = service.getEstoque(formGroup) as any;

        expect(estoque).toMatchObject({});
      });

      it('should return IEstoque', () => {
        const formGroup = service.createEstoqueFormGroup(sampleWithRequiredData);

        const estoque = service.getEstoque(formGroup) as any;

        expect(estoque).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEstoque should not enable id FormControl', () => {
        const formGroup = service.createEstoqueFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEstoque should disable id FormControl', () => {
        const formGroup = service.createEstoqueFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
