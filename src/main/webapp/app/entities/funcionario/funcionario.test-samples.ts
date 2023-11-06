import dayjs from 'dayjs/esm';

import { IFuncionario, NewFuncionario } from './funcionario.model';

export const sampleWithRequiredData: IFuncionario = {
  id: 32227,
  nome: 'ah',
  cpf: 'whoa',
  salario: 18.81,
  dataNasc: dayjs('2023-11-06'),
};

export const sampleWithPartialData: IFuncionario = {
  id: 32228,
  nome: 'park how',
  cpf: 'fix vigilant',
  salario: 7066.76,
  dataNasc: dayjs('2023-11-06'),
};

export const sampleWithFullData: IFuncionario = {
  id: 12863,
  nome: 'uh-huh clearly ounce',
  cpf: 'hollow loose what',
  salario: 24739.36,
  dataNasc: dayjs('2023-11-06'),
};

export const sampleWithNewData: NewFuncionario = {
  nome: 'yippee',
  cpf: 'alarming near',
  salario: 6913.45,
  dataNasc: dayjs('2023-11-06'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
