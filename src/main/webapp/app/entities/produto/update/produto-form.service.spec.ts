import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../produto.test-samples';

import { ProdutoFormService } from './produto-form.service';

describe('Produto Form Service', () => {
  let service: ProdutoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdutoFormService);
  });

  describe('Service methods', () => {
    describe('createProdutoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProdutoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            preco: expect.any(Object),
            descricao: expect.any(Object),
            codBarra: expect.any(Object),
            estoque: expect.any(Object),
            pedidos: expect.any(Object),
          }),
        );
      });

      it('passing IProduto should create a new form with FormGroup', () => {
        const formGroup = service.createProdutoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            preco: expect.any(Object),
            descricao: expect.any(Object),
            codBarra: expect.any(Object),
            estoque: expect.any(Object),
            pedidos: expect.any(Object),
          }),
        );
      });
    });

    describe('getProduto', () => {
      it('should return NewProduto for default Produto initial value', () => {
        const formGroup = service.createProdutoFormGroup(sampleWithNewData);

        const produto = service.getProduto(formGroup) as any;

        expect(produto).toMatchObject(sampleWithNewData);
      });

      it('should return NewProduto for empty Produto initial value', () => {
        const formGroup = service.createProdutoFormGroup();

        const produto = service.getProduto(formGroup) as any;

        expect(produto).toMatchObject({});
      });

      it('should return IProduto', () => {
        const formGroup = service.createProdutoFormGroup(sampleWithRequiredData);

        const produto = service.getProduto(formGroup) as any;

        expect(produto).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProduto should not enable id FormControl', () => {
        const formGroup = service.createProdutoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProduto should disable id FormControl', () => {
        const formGroup = service.createProdutoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
