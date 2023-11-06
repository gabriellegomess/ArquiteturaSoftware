import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFuncionario, NewFuncionario } from '../funcionario.model';

export type PartialUpdateFuncionario = Partial<IFuncionario> & Pick<IFuncionario, 'id'>;

type RestOf<T extends IFuncionario | NewFuncionario> = Omit<T, 'dataNasc'> & {
  dataNasc?: string | null;
};

export type RestFuncionario = RestOf<IFuncionario>;

export type NewRestFuncionario = RestOf<NewFuncionario>;

export type PartialUpdateRestFuncionario = RestOf<PartialUpdateFuncionario>;

export type EntityResponseType = HttpResponse<IFuncionario>;
export type EntityArrayResponseType = HttpResponse<IFuncionario[]>;

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/funcionarios');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(funcionario: NewFuncionario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(funcionario);
    return this.http
      .post<RestFuncionario>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(funcionario: IFuncionario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(funcionario);
    return this.http
      .put<RestFuncionario>(`${this.resourceUrl}/${this.getFuncionarioIdentifier(funcionario)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(funcionario: PartialUpdateFuncionario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(funcionario);
    return this.http
      .patch<RestFuncionario>(`${this.resourceUrl}/${this.getFuncionarioIdentifier(funcionario)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestFuncionario>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFuncionario[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFuncionarioIdentifier(funcionario: Pick<IFuncionario, 'id'>): number {
    return funcionario.id;
  }

  compareFuncionario(o1: Pick<IFuncionario, 'id'> | null, o2: Pick<IFuncionario, 'id'> | null): boolean {
    return o1 && o2 ? this.getFuncionarioIdentifier(o1) === this.getFuncionarioIdentifier(o2) : o1 === o2;
  }

  addFuncionarioToCollectionIfMissing<Type extends Pick<IFuncionario, 'id'>>(
    funcionarioCollection: Type[],
    ...funcionariosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const funcionarios: Type[] = funcionariosToCheck.filter(isPresent);
    if (funcionarios.length > 0) {
      const funcionarioCollectionIdentifiers = funcionarioCollection.map(
        funcionarioItem => this.getFuncionarioIdentifier(funcionarioItem)!,
      );
      const funcionariosToAdd = funcionarios.filter(funcionarioItem => {
        const funcionarioIdentifier = this.getFuncionarioIdentifier(funcionarioItem);
        if (funcionarioCollectionIdentifiers.includes(funcionarioIdentifier)) {
          return false;
        }
        funcionarioCollectionIdentifiers.push(funcionarioIdentifier);
        return true;
      });
      return [...funcionariosToAdd, ...funcionarioCollection];
    }
    return funcionarioCollection;
  }

  protected convertDateFromClient<T extends IFuncionario | NewFuncionario | PartialUpdateFuncionario>(funcionario: T): RestOf<T> {
    return {
      ...funcionario,
      dataNasc: funcionario.dataNasc?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restFuncionario: RestFuncionario): IFuncionario {
    return {
      ...restFuncionario,
      dataNasc: restFuncionario.dataNasc ? dayjs(restFuncionario.dataNasc) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFuncionario>): HttpResponse<IFuncionario> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFuncionario[]>): HttpResponse<IFuncionario[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
