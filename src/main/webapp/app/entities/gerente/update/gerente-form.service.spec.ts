import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../gerente.test-samples';

import { GerenteFormService } from './gerente-form.service';

describe('Gerente Form Service', () => {
  let service: GerenteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GerenteFormService);
  });

  describe('Service methods', () => {
    describe('createGerenteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGerenteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            cpf: expect.any(Object),
            salario: expect.any(Object),
            dataNasc: expect.any(Object),
          }),
        );
      });

      it('passing IGerente should create a new form with FormGroup', () => {
        const formGroup = service.createGerenteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            cpf: expect.any(Object),
            salario: expect.any(Object),
            dataNasc: expect.any(Object),
          }),
        );
      });
    });

    describe('getGerente', () => {
      it('should return NewGerente for default Gerente initial value', () => {
        const formGroup = service.createGerenteFormGroup(sampleWithNewData);

        const gerente = service.getGerente(formGroup) as any;

        expect(gerente).toMatchObject(sampleWithNewData);
      });

      it('should return NewGerente for empty Gerente initial value', () => {
        const formGroup = service.createGerenteFormGroup();

        const gerente = service.getGerente(formGroup) as any;

        expect(gerente).toMatchObject({});
      });

      it('should return IGerente', () => {
        const formGroup = service.createGerenteFormGroup(sampleWithRequiredData);

        const gerente = service.getGerente(formGroup) as any;

        expect(gerente).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGerente should not enable id FormControl', () => {
        const formGroup = service.createGerenteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGerente should disable id FormControl', () => {
        const formGroup = service.createGerenteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
