import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'gerente',
        data: { pageTitle: 'stockXpertApp.gerente.home.title' },
        loadChildren: () => import('./gerente/gerente.routes'),
      },
      {
        path: 'funcionario',
        data: { pageTitle: 'stockXpertApp.funcionario.home.title' },
        loadChildren: () => import('./funcionario/funcionario.routes'),
      },
      {
        path: 'produto',
        data: { pageTitle: 'stockXpertApp.produto.home.title' },
        loadChildren: () => import('./produto/produto.routes'),
      },
      {
        path: 'estoque',
        data: { pageTitle: 'stockXpertApp.estoque.home.title' },
        loadChildren: () => import('./estoque/estoque.routes'),
      },
      {
        path: 'pedido',
        data: { pageTitle: 'stockXpertApp.pedido.home.title' },
        loadChildren: () => import('./pedido/pedido.routes'),
      },
      {
        path: 'cliente',
        data: { pageTitle: 'stockXpertApp.cliente.home.title' },
        loadChildren: () => import('./cliente/cliente.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
