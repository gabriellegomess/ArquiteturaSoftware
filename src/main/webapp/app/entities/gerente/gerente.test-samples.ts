import dayjs from 'dayjs/esm';

import { IGerente, NewGerente } from './gerente.model';

export const sampleWithRequiredData: IGerente = {
  id: 12248,
  nome: 'yahoo',
  cpf: 'hopelessly outvote beneath',
  salario: 18681.88,
  dataNasc: dayjs('2023-11-06'),
};

export const sampleWithPartialData: IGerente = {
  id: 26607,
  nome: 'vaguely',
  cpf: 'around banking elegant',
  salario: 32745.51,
  dataNasc: dayjs('2023-11-06'),
};

export const sampleWithFullData: IGerente = {
  id: 20330,
  nome: 'for bestir',
  cpf: 'pace rusty yahoo',
  salario: 24427.73,
  dataNasc: dayjs('2023-11-06'),
};

export const sampleWithNewData: NewGerente = {
  nome: 'cartoon abet',
  cpf: 'abaft',
  salario: 30487,
  dataNasc: dayjs('2023-11-06'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
