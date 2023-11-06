import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IGerente } from '../gerente.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../gerente.test-samples';

import { GerenteService, RestGerente } from './gerente.service';

const requireRestSample: RestGerente = {
  ...sampleWithRequiredData,
  dataNasc: sampleWithRequiredData.dataNasc?.format(DATE_FORMAT),
};

describe('Gerente Service', () => {
  let service: GerenteService;
  let httpMock: HttpTestingController;
  let expectedResult: IGerente | IGerente[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GerenteService);
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

    it('should create a Gerente', () => {
      const gerente = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gerente).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Gerente', () => {
      const gerente = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gerente).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Gerente', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Gerente', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Gerente', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGerenteToCollectionIfMissing', () => {
      it('should add a Gerente to an empty array', () => {
        const gerente: IGerente = sampleWithRequiredData;
        expectedResult = service.addGerenteToCollectionIfMissing([], gerente);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gerente);
      });

      it('should not add a Gerente to an array that contains it', () => {
        const gerente: IGerente = sampleWithRequiredData;
        const gerenteCollection: IGerente[] = [
          {
            ...gerente,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGerenteToCollectionIfMissing(gerenteCollection, gerente);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Gerente to an array that doesn't contain it", () => {
        const gerente: IGerente = sampleWithRequiredData;
        const gerenteCollection: IGerente[] = [sampleWithPartialData];
        expectedResult = service.addGerenteToCollectionIfMissing(gerenteCollection, gerente);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gerente);
      });

      it('should add only unique Gerente to an array', () => {
        const gerenteArray: IGerente[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gerenteCollection: IGerente[] = [sampleWithRequiredData];
        expectedResult = service.addGerenteToCollectionIfMissing(gerenteCollection, ...gerenteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gerente: IGerente = sampleWithRequiredData;
        const gerente2: IGerente = sampleWithPartialData;
        expectedResult = service.addGerenteToCollectionIfMissing([], gerente, gerente2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gerente);
        expect(expectedResult).toContain(gerente2);
      });

      it('should accept null and undefined values', () => {
        const gerente: IGerente = sampleWithRequiredData;
        expectedResult = service.addGerenteToCollectionIfMissing([], null, gerente, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gerente);
      });

      it('should return initial array if no Gerente is added', () => {
        const gerenteCollection: IGerente[] = [sampleWithRequiredData];
        expectedResult = service.addGerenteToCollectionIfMissing(gerenteCollection, undefined, null);
        expect(expectedResult).toEqual(gerenteCollection);
      });
    });

    describe('compareGerente', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGerente(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGerente(entity1, entity2);
        const compareResult2 = service.compareGerente(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGerente(entity1, entity2);
        const compareResult2 = service.compareGerente(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGerente(entity1, entity2);
        const compareResult2 = service.compareGerente(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
