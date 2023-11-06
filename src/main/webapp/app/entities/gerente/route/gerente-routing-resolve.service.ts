import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGerente } from '../gerente.model';
import { GerenteService } from '../service/gerente.service';

export const gerenteResolve = (route: ActivatedRouteSnapshot): Observable<null | IGerente> => {
  const id = route.params['id'];
  if (id) {
    return inject(GerenteService)
      .find(id)
      .pipe(
        mergeMap((gerente: HttpResponse<IGerente>) => {
          if (gerente.body) {
            return of(gerente.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default gerenteResolve;
