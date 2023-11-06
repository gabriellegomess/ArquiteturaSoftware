import dayjs from 'dayjs/esm';

export interface IGerente {
  id: number;
  nome?: string | null;
  cpf?: string | null;
  salario?: number | null;
  dataNasc?: dayjs.Dayjs | null;
}

export type NewGerente = Omit<IGerente, 'id'> & { id: null };
