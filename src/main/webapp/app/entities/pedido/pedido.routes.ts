import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PedidoComponent } from './list/pedido.component';
import { PedidoDetailComponent } from './detail/pedido-detail.component';
import { PedidoUpdateComponent } from './update/pedido-update.component';
import PedidoResolve from './route/pedido-routing-resolve.service';

const pedidoRoute: Routes = [
  {
    path: '',
    component: PedidoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PedidoDetailComponent,
    resolve: {
      pedido: PedidoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PedidoUpdateComponent,
    resolve: {
      pedido: PedidoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PedidoUpdateComponent,
    resolve: {
      pedido: PedidoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pedidoRoute;
