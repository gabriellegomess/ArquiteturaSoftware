import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFuncionario } from '../funcionario.model';
import { FuncionarioService } from '../service/funcionario.service';

export const funcionarioResolve = (route: ActivatedRouteSnapshot): Observable<null | IFuncionario> => {
  const id = route.params['id'];
  if (id) {
    return inject(FuncionarioService)
      .find(id)
      .pipe(
        mergeMap((funcionario: HttpResponse<IFuncionario>) => {
          if (funcionario.body) {
            return of(funcionario.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default funcionarioResolve;
