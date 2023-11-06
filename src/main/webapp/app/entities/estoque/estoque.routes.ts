import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EstoqueComponent } from './list/estoque.component';
import { EstoqueDetailComponent } from './detail/estoque-detail.component';
import { EstoqueUpdateComponent } from './update/estoque-update.component';
import EstoqueResolve from './route/estoque-routing-resolve.service';

const estoqueRoute: Routes = [
  {
    path: '',
    component: EstoqueComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EstoqueDetailComponent,
    resolve: {
      estoque: EstoqueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EstoqueUpdateComponent,
    resolve: {
      estoque: EstoqueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EstoqueUpdateComponent,
    resolve: {
      estoque: EstoqueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default estoqueRoute;
