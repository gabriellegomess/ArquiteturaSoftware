import { IProduto, NewProduto } from './produto.model';

export const sampleWithRequiredData: IProduto = {
  id: 14738,
  nome: 'onion',
  preco: 32581.68,
  codBarra: 28237.64,
};

export const sampleWithPartialData: IProduto = {
  id: 7278,
  nome: 'reflecting',
  preco: 12623.89,
  codBarra: 790.92,
};

export const sampleWithFullData: IProduto = {
  id: 2597,
  nome: 'urgently consequently gadzooks',
  preco: 32163.44,
  descricao: 'somber graph instead',
  codBarra: 18298.71,
};

export const sampleWithNewData: NewProduto = {
  nome: 'short discourse punctually',
  preco: 24408.63,
  codBarra: 29700.57,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
