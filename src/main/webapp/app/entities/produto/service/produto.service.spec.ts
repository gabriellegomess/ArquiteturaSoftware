import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProduto } from '../produto.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../produto.test-samples';

import { ProdutoService } from './produto.service';

const requireRestSample: IProduto = {
  ...sampleWithRequiredData,
};

describe('Produto Service', () => {
  let service: ProdutoService;
  let httpMock: HttpTestingController;
  let expectedResult: IProduto | IProduto[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProdutoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Produto', () => {
      const produto = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(produto).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Produto', () => {
      const produto = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(produto).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Produto', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Produto', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Produto', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProdutoToCollectionIfMissing', () => {
      it('should add a Produto to an empty array', () => {
        const produto: IProduto = sampleWithRequiredData;
        expectedResult = service.addProdutoToCollectionIfMissing([], produto);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(produto);
      });

      it('should not add a Produto to an array that contains it', () => {
        const produto: IProduto = sampleWithRequiredData;
        const produtoCollection: IProduto[] = [
          {
            ...produto,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProdutoToCollectionIfMissing(produtoCollection, produto);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Produto to an array that doesn't contain it", () => {
        const produto: IProduto = sampleWithRequiredData;
        const produtoCollection: IProduto[] = [sampleWithPartialData];
        expectedResult = service.addProdutoToCollectionIfMissing(produtoCollection, produto);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(produto);
      });

      it('should add only unique Produto to an array', () => {
        const produtoArray: IProduto[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const produtoCollection: IProduto[] = [sampleWithRequiredData];
        expectedResult = service.addProdutoToCollectionIfMissing(produtoCollection, ...produtoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const produto: IProduto = sampleWithRequiredData;
        const produto2: IProduto = sampleWithPartialData;
        expectedResult = service.addProdutoToCollectionIfMissing([], produto, produto2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(produto);
        expect(expectedResult).toContain(produto2);
      });

      it('should accept null and undefined values', () => {
        const produto: IProduto = sampleWithRequiredData;
        expectedResult = service.addProdutoToCollectionIfMissing([], null, produto, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(produto);
      });

      it('should return initial array if no Produto is added', () => {
        const produtoCollection: IProduto[] = [sampleWithRequiredData];
        expectedResult = service.addProdutoToCollectionIfMissing(produtoCollection, undefined, null);
        expect(expectedResult).toEqual(produtoCollection);
      });
    });

    describe('compareProduto', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProduto(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProduto(entity1, entity2);
        const compareResult2 = service.compareProduto(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProduto(entity1, entity2);
        const compareResult2 = service.compareProduto(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProduto(entity1, entity2);
        const compareResult2 = service.compareProduto(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
