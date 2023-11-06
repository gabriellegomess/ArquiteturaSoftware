import { IEstoque } from 'app/entities/estoque/estoque.model';
import { IPedido } from 'app/entities/pedido/pedido.model';

export interface IProduto {
  id: number;
  nome?: string | null;
  preco?: number | null;
  descricao?: string | null;
  codBarra?: number | null;
  estoque?: Pick<IEstoque, 'id'> | null;
  pedidos?: Pick<IPedido, 'id'>[] | null;
}

export type NewProduto = Omit<IProduto, 'id'> & { id: null };
