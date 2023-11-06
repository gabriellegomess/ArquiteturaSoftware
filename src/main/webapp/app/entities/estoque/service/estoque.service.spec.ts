import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEstoque } from '../estoque.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../estoque.test-samples';

import { EstoqueService } from './estoque.service';

const requireRestSample: IEstoque = {
  ...sampleWithRequiredData,
};

describe('Estoque Service', () => {
  let service: EstoqueService;
  let httpMock: HttpTestingController;
  let expectedResult: IEstoque | IEstoque[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EstoqueService);
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

    it('should create a Estoque', () => {
      const estoque = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(estoque).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Estoque', () => {
      const estoque = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(estoque).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Estoque', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Estoque', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Estoque', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEstoqueToCollectionIfMissing', () => {
      it('should add a Estoque to an empty array', () => {
        const estoque: IEstoque = sampleWithRequiredData;
        expectedResult = service.addEstoqueToCollectionIfMissing([], estoque);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estoque);
      });

      it('should not add a Estoque to an array that contains it', () => {
        const estoque: IEstoque = sampleWithRequiredData;
        const estoqueCollection: IEstoque[] = [
          {
            ...estoque,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEstoqueToCollectionIfMissing(estoqueCollection, estoque);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Estoque to an array that doesn't contain it", () => {
        const estoque: IEstoque = sampleWithRequiredData;
        const estoqueCollection: IEstoque[] = [sampleWithPartialData];
        expectedResult = service.addEstoqueToCollectionIfMissing(estoqueCollection, estoque);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estoque);
      });

      it('should add only unique Estoque to an array', () => {
        const estoqueArray: IEstoque[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const estoqueCollection: IEstoque[] = [sampleWithRequiredData];
        expectedResult = service.addEstoqueToCollectionIfMissing(estoqueCollection, ...estoqueArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const estoque: IEstoque = sampleWithRequiredData;
        const estoque2: IEstoque = sampleWithPartialData;
        expectedResult = service.addEstoqueToCollectionIfMissing([], estoque, estoque2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estoque);
        expect(expectedResult).toContain(estoque2);
      });

      it('should accept null and undefined values', () => {
        const estoque: IEstoque = sampleWithRequiredData;
        expectedResult = service.addEstoqueToCollectionIfMissing([], null, estoque, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estoque);
      });

      it('should return initial array if no Estoque is added', () => {
        const estoqueCollection: IEstoque[] = [sampleWithRequiredData];
        expectedResult = service.addEstoqueToCollectionIfMissing(estoqueCollection, undefined, null);
        expect(expectedResult).toEqual(estoqueCollection);
      });
    });

    describe('compareEstoque', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEstoque(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEstoque(entity1, entity2);
        const compareResult2 = service.compareEstoque(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEstoque(entity1, entity2);
        const compareResult2 = service.compareEstoque(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEstoque(entity1, entity2);
        const compareResult2 = service.compareEstoque(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
