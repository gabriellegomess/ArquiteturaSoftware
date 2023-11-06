import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPedido, NewPedido } from '../pedido.model';

export type PartialUpdatePedido = Partial<IPedido> & Pick<IPedido, 'id'>;

type RestOf<T extends IPedido | NewPedido> = Omit<T, 'dataPedido'> & {
  dataPedido?: string | null;
};

export type RestPedido = RestOf<IPedido>;

export type NewRestPedido = RestOf<NewPedido>;

export type PartialUpdateRestPedido = RestOf<PartialUpdatePedido>;

export type EntityResponseType = HttpResponse<IPedido>;
export type EntityArrayResponseType = HttpResponse<IPedido[]>;

@Injectable({ providedIn: 'root' })
export class PedidoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pedidos');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(pedido: NewPedido): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pedido);
    return this.http
      .post<RestPedido>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(pedido: IPedido): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pedido);
    return this.http
      .put<RestPedido>(`${this.resourceUrl}/${this.getPedidoIdentifier(pedido)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(pedido: PartialUpdatePedido): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pedido);
    return this.http
      .patch<RestPedido>(`${this.resourceUrl}/${this.getPedidoIdentifier(pedido)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPedido>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPedido[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPedidoIdentifier(pedido: Pick<IPedido, 'id'>): number {
    return pedido.id;
  }

  comparePedido(o1: Pick<IPedido, 'id'> | null, o2: Pick<IPedido, 'id'> | null): boolean {
    return o1 && o2 ? this.getPedidoIdentifier(o1) === this.getPedidoIdentifier(o2) : o1 === o2;
  }

  addPedidoToCollectionIfMissing<Type extends Pick<IPedido, 'id'>>(
    pedidoCollection: Type[],
    ...pedidosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pedidos: Type[] = pedidosToCheck.filter(isPresent);
    if (pedidos.length > 0) {
      const pedidoCollectionIdentifiers = pedidoCollection.map(pedidoItem => this.getPedidoIdentifier(pedidoItem)!);
      const pedidosToAdd = pedidos.filter(pedidoItem => {
        const pedidoIdentifier = this.getPedidoIdentifier(pedidoItem);
        if (pedidoCollectionIdentifiers.includes(pedidoIdentifier)) {
          return false;
        }
        pedidoCollectionIdentifiers.push(pedidoIdentifier);
        return true;
      });
      return [...pedidosToAdd, ...pedidoCollection];
    }
    return pedidoCollection;
  }

  protected convertDateFromClient<T extends IPedido | NewPedido | PartialUpdatePedido>(pedido: T): RestOf<T> {
    return {
      ...pedido,
      dataPedido: pedido.dataPedido?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPedido: RestPedido): IPedido {
    return {
      ...restPedido,
      dataPedido: restPedido.dataPedido ? dayjs(restPedido.dataPedido) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPedido>): HttpResponse<IPedido> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPedido[]>): HttpResponse<IPedido[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
