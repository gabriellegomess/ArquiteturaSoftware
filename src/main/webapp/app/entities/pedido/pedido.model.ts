import dayjs from 'dayjs/esm';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { IProduto } from 'app/entities/produto/produto.model';

export interface IPedido {
  id: number;
  dataPedido?: dayjs.Dayjs | null;
  quantidade?: number | null;
  cliente?: Pick<ICliente, 'id'> | null;
  produtos?: Pick<IProduto, 'id'>[] | null;
}

export type NewPedido = Omit<IPedido, 'id'> & { id: null };
