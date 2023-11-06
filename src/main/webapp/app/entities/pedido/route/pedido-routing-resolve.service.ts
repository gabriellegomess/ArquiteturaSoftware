import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPedido } from '../pedido.model';
import { PedidoService } from '../service/pedido.service';

export const pedidoResolve = (route: ActivatedRouteSnapshot): Observable<null | IPedido> => {
  const id = route.params['id'];
  if (id) {
    return inject(PedidoService)
      .find(id)
      .pipe(
        mergeMap((pedido: HttpResponse<IPedido>) => {
          if (pedido.body) {
            return of(pedido.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default pedidoResolve;
