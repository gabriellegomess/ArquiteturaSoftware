import NavbarItem from 'app/layouts/navbar/navbar-item.model';

export const EntityNavbarItems: NavbarItem[] = [
  {
    name: 'Gerente',
    route: '/gerente',
    translationKey: 'global.menu.entities.gerente',
  },
  {
    name: 'Funcionario',
    route: '/funcionario',
    translationKey: 'global.menu.entities.funcionario',
  },
  {
    name: 'Produto',
    route: '/produto',
    translationKey: 'global.menu.entities.produto',
  },
  {
    name: 'Estoque',
    route: '/estoque',
    translationKey: 'global.menu.entities.estoque',
  },
  {
    name: 'Pedido',
    route: '/pedido',
    translationKey: 'global.menu.entities.pedido',
  },
  {
    name: 'Cliente',
    route: '/cliente',
    translationKey: 'global.menu.entities.cliente',
  },
];
