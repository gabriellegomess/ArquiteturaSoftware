import { IEstoque, NewEstoque } from './estoque.model';

export const sampleWithRequiredData: IEstoque = {
  id: 14488,
  qtde: 1951,
};

export const sampleWithPartialData: IEstoque = {
  id: 20235,
  qtde: 18993,
};

export const sampleWithFullData: IEstoque = {
  id: 6907,
  qtde: 32003,
};

export const sampleWithNewData: NewEstoque = {
  qtde: 22281,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
