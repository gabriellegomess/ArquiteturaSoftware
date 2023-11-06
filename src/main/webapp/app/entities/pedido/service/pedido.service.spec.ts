import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPedido } from '../pedido.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../pedido.test-samples';

import { PedidoService, RestPedido } from './pedido.service';

const requireRestSample: RestPedido = {
  ...sampleWithRequiredData,
  dataPedido: sampleWithRequiredData.dataPedido?.toJSON(),
};

describe('Pedido Service', () => {
  let service: PedidoService;
  let httpMock: HttpTestingController;
  let expectedResult: IPedido | IPedido[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PedidoService);
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

    it('should create a Pedido', () => {
      const pedido = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pedido).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Pedido', () => {
      const pedido = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pedido).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Pedido', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Pedido', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Pedido', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPedidoToCollectionIfMissing', () => {
      it('should add a Pedido to an empty array', () => {
        const pedido: IPedido = sampleWithRequiredData;
        expectedResult = service.addPedidoToCollectionIfMissing([], pedido);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pedido);
      });

      it('should not add a Pedido to an array that contains it', () => {
        const pedido: IPedido = sampleWithRequiredData;
        const pedidoCollection: IPedido[] = [
          {
            ...pedido,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPedidoToCollectionIfMissing(pedidoCollection, pedido);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Pedido to an array that doesn't contain it", () => {
        const pedido: IPedido = sampleWithRequiredData;
        const pedidoCollection: IPedido[] = [sampleWithPartialData];
        expectedResult = service.addPedidoToCollectionIfMissing(pedidoCollection, pedido);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pedido);
      });

      it('should add only unique Pedido to an array', () => {
        const pedidoArray: IPedido[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pedidoCollection: IPedido[] = [sampleWithRequiredData];
        expectedResult = service.addPedidoToCollectionIfMissing(pedidoCollection, ...pedidoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pedido: IPedido = sampleWithRequiredData;
        const pedido2: IPedido = sampleWithPartialData;
        expectedResult = service.addPedidoToCollectionIfMissing([], pedido, pedido2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pedido);
        expect(expectedResult).toContain(pedido2);
      });

      it('should accept null and undefined values', () => {
        const pedido: IPedido = sampleWithRequiredData;
        expectedResult = service.addPedidoToCollectionIfMissing([], null, pedido, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pedido);
      });

      it('should return initial array if no Pedido is added', () => {
        const pedidoCollection: IPedido[] = [sampleWithRequiredData];
        expectedResult = service.addPedidoToCollectionIfMissing(pedidoCollection, undefined, null);
        expect(expectedResult).toEqual(pedidoCollection);
      });
    });

    describe('comparePedido', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePedido(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePedido(entity1, entity2);
        const compareResult2 = service.comparePedido(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePedido(entity1, entity2);
        const compareResult2 = service.comparePedido(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePedido(entity1, entity2);
        const compareResult2 = service.comparePedido(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
