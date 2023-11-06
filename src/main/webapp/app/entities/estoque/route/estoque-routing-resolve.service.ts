import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEstoque } from '../estoque.model';
import { EstoqueService } from '../service/estoque.service';

export const estoqueResolve = (route: ActivatedRouteSnapshot): Observable<null | IEstoque> => {
  const id = route.params['id'];
  if (id) {
    return inject(EstoqueService)
      .find(id)
      .pipe(
        mergeMap((estoque: HttpResponse<IEstoque>) => {
          if (estoque.body) {
            return of(estoque.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default estoqueResolve;
