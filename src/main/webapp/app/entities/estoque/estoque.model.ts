import { IGerente } from 'app/entities/gerente/gerente.model';

export interface IEstoque {
  id: number;
  qtde?: number | null;
  gerente?: Pick<IGerente, 'id'> | null;
}

export type NewEstoque = Omit<IEstoque, 'id'> & { id: null };
