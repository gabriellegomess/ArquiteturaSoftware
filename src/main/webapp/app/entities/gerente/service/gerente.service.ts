import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGerente, NewGerente } from '../gerente.model';

export type PartialUpdateGerente = Partial<IGerente> & Pick<IGerente, 'id'>;

type RestOf<T extends IGerente | NewGerente> = Omit<T, 'dataNasc'> & {
  dataNasc?: string | null;
};

export type RestGerente = RestOf<IGerente>;

export type NewRestGerente = RestOf<NewGerente>;

export type PartialUpdateRestGerente = RestOf<PartialUpdateGerente>;

export type EntityResponseType = HttpResponse<IGerente>;
export type EntityArrayResponseType = HttpResponse<IGerente[]>;

@Injectable({ providedIn: 'root' })
export class GerenteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/gerentes');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(gerente: NewGerente): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gerente);
    return this.http
      .post<RestGerente>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(gerente: IGerente): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gerente);
    return this.http
      .put<RestGerente>(`${this.resourceUrl}/${this.getGerenteIdentifier(gerente)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(gerente: PartialUpdateGerente): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gerente);
    return this.http
      .patch<RestGerente>(`${this.resourceUrl}/${this.getGerenteIdentifier(gerente)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestGerente>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestGerente[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGerenteIdentifier(gerente: Pick<IGerente, 'id'>): number {
    return gerente.id;
  }

  compareGerente(o1: Pick<IGerente, 'id'> | null, o2: Pick<IGerente, 'id'> | null): boolean {
    return o1 && o2 ? this.getGerenteIdentifier(o1) === this.getGerenteIdentifier(o2) : o1 === o2;
  }

  addGerenteToCollectionIfMissing<Type extends Pick<IGerente, 'id'>>(
    gerenteCollection: Type[],
    ...gerentesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const gerentes: Type[] = gerentesToCheck.filter(isPresent);
    if (gerentes.length > 0) {
      const gerenteCollectionIdentifiers = gerenteCollection.map(gerenteItem => this.getGerenteIdentifier(gerenteItem)!);
      const gerentesToAdd = gerentes.filter(gerenteItem => {
        const gerenteIdentifier = this.getGerenteIdentifier(gerenteItem);
        if (gerenteCollectionIdentifiers.includes(gerenteIdentifier)) {
          return false;
        }
        gerenteCollectionIdentifiers.push(gerenteIdentifier);
        return true;
      });
      return [...gerentesToAdd, ...gerenteCollection];
    }
    return gerenteCollection;
  }

  protected convertDateFromClient<T extends IGerente | NewGerente | PartialUpdateGerente>(gerente: T): RestOf<T> {
    return {
      ...gerente,
      dataNasc: gerente.dataNasc?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restGerente: RestGerente): IGerente {
    return {
      ...restGerente,
      dataNasc: restGerente.dataNasc ? dayjs(restGerente.dataNasc) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestGerente>): HttpResponse<IGerente> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestGerente[]>): HttpResponse<IGerente[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
