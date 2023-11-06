import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { GerenteComponent } from './list/gerente.component';
import { GerenteDetailComponent } from './detail/gerente-detail.component';
import { GerenteUpdateComponent } from './update/gerente-update.component';
import GerenteResolve from './route/gerente-routing-resolve.service';

const gerenteRoute: Routes = [
  {
    path: '',
    component: GerenteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GerenteDetailComponent,
    resolve: {
      gerente: GerenteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GerenteUpdateComponent,
    resolve: {
      gerente: GerenteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GerenteUpdateComponent,
    resolve: {
      gerente: GerenteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default gerenteRoute;
