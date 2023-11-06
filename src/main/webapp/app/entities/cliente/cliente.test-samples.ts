import { ICliente, NewCliente } from './cliente.model';

export const sampleWithRequiredData: ICliente = {
  id: 29520,
  nome: 'sans',
  cpf: 'provided given ha',
};

export const sampleWithPartialData: ICliente = {
  id: 20260,
  nome: 'defiantly',
  cpf: 'rough queasily gee',
};

export const sampleWithFullData: ICliente = {
  id: 13104,
  nome: 'ward',
  cpf: 'black even',
};

export const sampleWithNewData: NewCliente = {
  nome: 'sans crossly lanky',
  cpf: 'scoot off-ramp easily',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
