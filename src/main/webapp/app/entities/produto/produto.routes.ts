import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProdutoComponent } from './list/produto.component';
import { ProdutoDetailComponent } from './detail/produto-detail.component';
import { ProdutoUpdateComponent } from './update/produto-update.component';
import ProdutoResolve from './route/produto-routing-resolve.service';

const produtoRoute: Routes = [
  {
    path: '',
    component: ProdutoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProdutoDetailComponent,
    resolve: {
      produto: ProdutoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProdutoUpdateComponent,
    resolve: {
      produto: ProdutoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProdutoUpdateComponent,
    resolve: {
      produto: ProdutoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default produtoRoute;
