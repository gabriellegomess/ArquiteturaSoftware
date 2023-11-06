import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEstoque, NewEstoque } from '../estoque.model';

export type PartialUpdateEstoque = Partial<IEstoque> & Pick<IEstoque, 'id'>;

export type EntityResponseType = HttpResponse<IEstoque>;
export type EntityArrayResponseType = HttpResponse<IEstoque[]>;

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/estoques');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(estoque: NewEstoque): Observable<EntityResponseType> {
    return this.http.post<IEstoque>(this.resourceUrl, estoque, { observe: 'response' });
  }

  update(estoque: IEstoque): Observable<EntityResponseType> {
    return this.http.put<IEstoque>(`${this.resourceUrl}/${this.getEstoqueIdentifier(estoque)}`, estoque, { observe: 'response' });
  }

  partialUpdate(estoque: PartialUpdateEstoque): Observable<EntityResponseType> {
    return this.http.patch<IEstoque>(`${this.resourceUrl}/${this.getEstoqueIdentifier(estoque)}`, estoque, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEstoque>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEstoque[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEstoqueIdentifier(estoque: Pick<IEstoque, 'id'>): number {
    return estoque.id;
  }

  compareEstoque(o1: Pick<IEstoque, 'id'> | null, o2: Pick<IEstoque, 'id'> | null): boolean {
    return o1 && o2 ? this.getEstoqueIdentifier(o1) === this.getEstoqueIdentifier(o2) : o1 === o2;
  }

  addEstoqueToCollectionIfMissing<Type extends Pick<IEstoque, 'id'>>(
    estoqueCollection: Type[],
    ...estoquesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const estoques: Type[] = estoquesToCheck.filter(isPresent);
    if (estoques.length > 0) {
      const estoqueCollectionIdentifiers = estoqueCollection.map(estoqueItem => this.getEstoqueIdentifier(estoqueItem)!);
      const estoquesToAdd = estoques.filter(estoqueItem => {
        const estoqueIdentifier = this.getEstoqueIdentifier(estoqueItem);
        if (estoqueCollectionIdentifiers.includes(estoqueIdentifier)) {
          return false;
        }
        estoqueCollectionIdentifiers.push(estoqueIdentifier);
        return true;
      });
      return [...estoquesToAdd, ...estoqueCollection];
    }
    return estoqueCollection;
  }
}
