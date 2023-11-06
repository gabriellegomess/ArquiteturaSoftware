import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { FuncionarioComponent } from './list/funcionario.component';
import { FuncionarioDetailComponent } from './detail/funcionario-detail.component';
import { FuncionarioUpdateComponent } from './update/funcionario-update.component';
import FuncionarioResolve from './route/funcionario-routing-resolve.service';

const funcionarioRoute: Routes = [
  {
    path: '',
    component: FuncionarioComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FuncionarioDetailComponent,
    resolve: {
      funcionario: FuncionarioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FuncionarioUpdateComponent,
    resolve: {
      funcionario: FuncionarioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FuncionarioUpdateComponent,
    resolve: {
      funcionario: FuncionarioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default funcionarioRoute;
