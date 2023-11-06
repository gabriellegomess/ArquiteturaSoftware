import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ClienteComponent } from './list/cliente.component';
import { ClienteDetailComponent } from './detail/cliente-detail.component';
import { ClienteUpdateComponent } from './update/cliente-update.component';
import ClienteResolve from './route/cliente-routing-resolve.service';

const clienteRoute: Routes = [
  {
    path: '',
    component: ClienteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClienteDetailComponent,
    resolve: {
      cliente: ClienteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClienteUpdateComponent,
    resolve: {
      cliente: ClienteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClienteUpdateComponent,
    resolve: {
      cliente: ClienteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default clienteRoute;
