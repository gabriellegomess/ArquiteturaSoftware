import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProduto, NewProduto } from '../produto.model';

export type PartialUpdateProduto = Partial<IProduto> & Pick<IProduto, 'id'>;

export type EntityResponseType = HttpResponse<IProduto>;
export type EntityArrayResponseType = HttpResponse<IProduto[]>;

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/produtos');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(produto: NewProduto): Observable<EntityResponseType> {
    return this.http.post<IProduto>(this.resourceUrl, produto, { observe: 'response' });
  }

  update(produto: IProduto): Observable<EntityResponseType> {
    return this.http.put<IProduto>(`${this.resourceUrl}/${this.getProdutoIdentifier(produto)}`, produto, { observe: 'response' });
  }

  partialUpdate(produto: PartialUpdateProduto): Observable<EntityResponseType> {
    return this.http.patch<IProduto>(`${this.resourceUrl}/${this.getProdutoIdentifier(produto)}`, produto, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProduto>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProduto[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProdutoIdentifier(produto: Pick<IProduto, 'id'>): number {
    return produto.id;
  }

  compareProduto(o1: Pick<IProduto, 'id'> | null, o2: Pick<IProduto, 'id'> | null): boolean {
    return o1 && o2 ? this.getProdutoIdentifier(o1) === this.getProdutoIdentifier(o2) : o1 === o2;
  }

  addProdutoToCollectionIfMissing<Type extends Pick<IProduto, 'id'>>(
    produtoCollection: Type[],
    ...produtosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const produtos: Type[] = produtosToCheck.filter(isPresent);
    if (produtos.length > 0) {
      const produtoCollectionIdentifiers = produtoCollection.map(produtoItem => this.getProdutoIdentifier(produtoItem)!);
      const produtosToAdd = produtos.filter(produtoItem => {
        const produtoIdentifier = this.getProdutoIdentifier(produtoItem);
        if (produtoCollectionIdentifiers.includes(produtoIdentifier)) {
          return false;
        }
        produtoCollectionIdentifiers.push(produtoIdentifier);
        return true;
      });
      return [...produtosToAdd, ...produtoCollection];
    }
    return produtoCollection;
  }
}
