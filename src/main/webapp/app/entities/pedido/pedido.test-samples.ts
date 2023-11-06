import dayjs from 'dayjs/esm';

import { IPedido, NewPedido } from './pedido.model';

export const sampleWithRequiredData: IPedido = {
  id: 27059,
  dataPedido: dayjs('2023-11-06T10:04'),
  quantidade: 6254,
};

export const sampleWithPartialData: IPedido = {
  id: 9096,
  dataPedido: dayjs('2023-11-06T04:13'),
  quantidade: 18069,
};

export const sampleWithFullData: IPedido = {
  id: 28780,
  dataPedido: dayjs('2023-11-06T10:38'),
  quantidade: 3210,
};

export const sampleWithNewData: NewPedido = {
  dataPedido: dayjs('2023-11-06T15:38'),
  quantidade: 26405,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
