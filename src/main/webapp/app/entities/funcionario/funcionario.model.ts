import dayjs from 'dayjs/esm';
import { IGerente } from 'app/entities/gerente/gerente.model';

export interface IFuncionario {
  id: number;
  nome?: string | null;
  cpf?: string | null;
  salario?: number | null;
  dataNasc?: dayjs.Dayjs | null;
  gerente?: Pick<IGerente, 'id'> | null;
}

export type NewFuncionario = Omit<IFuncionario, 'id'> & { id: null };
