import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProduto } from '../produto.model';
import { ProdutoService } from '../service/produto.service';

export const produtoResolve = (route: ActivatedRouteSnapshot): Observable<null | IProduto> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProdutoService)
      .find(id)
      .pipe(
        mergeMap((produto: HttpResponse<IProduto>) => {
          if (produto.body) {
            return of(produto.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default produtoResolve;
