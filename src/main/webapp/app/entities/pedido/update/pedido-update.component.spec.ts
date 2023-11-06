import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { IProduto } from 'app/entities/produto/produto.model';
import { ProdutoService } from 'app/entities/produto/service/produto.service';
import { IPedido } from '../pedido.model';
import { PedidoService } from '../service/pedido.service';
import { PedidoFormService } from './pedido-form.service';

import { PedidoUpdateComponent } from './pedido-update.component';

describe('Pedido Management Update Component', () => {
  let comp: PedidoUpdateComponent;
  let fixture: ComponentFixture<PedidoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pedidoFormService: PedidoFormService;
  let pedidoService: PedidoService;
  let clienteService: ClienteService;
  let produtoService: ProdutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PedidoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PedidoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PedidoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pedidoFormService = TestBed.inject(PedidoFormService);
    pedidoService = TestBed.inject(PedidoService);
    clienteService = TestBed.inject(ClienteService);
    produtoService = TestBed.inject(ProdutoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Cliente query and add missing value', () => {
      const pedido: IPedido = { id: 456 };
      const cliente: ICliente = { id: 21655 };
      pedido.cliente = cliente;

      const clienteCollection: ICliente[] = [{ id: 17290 }];
      jest.spyOn(clienteService, 'query').mockReturnValue(of(new HttpResponse({ body: clienteCollection })));
      const additionalClientes = [cliente];
      const expectedCollection: ICliente[] = [...additionalClientes, ...clienteCollection];
      jest.spyOn(clienteService, 'addClienteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      expect(clienteService.query).toHaveBeenCalled();
      expect(clienteService.addClienteToCollectionIfMissing).toHaveBeenCalledWith(
        clienteCollection,
        ...additionalClientes.map(expect.objectContaining),
      );
      expect(comp.clientesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Produto query and add missing value', () => {
      const pedido: IPedido = { id: 456 };
      const produtos: IProduto[] = [{ id: 21548 }];
      pedido.produtos = produtos;

      const produtoCollection: IProduto[] = [{ id: 25720 }];
      jest.spyOn(produtoService, 'query').mockReturnValue(of(new HttpResponse({ body: produtoCollection })));
      const additionalProdutos = [...produtos];
      const expectedCollection: IProduto[] = [...additionalProdutos, ...produtoCollection];
      jest.spyOn(produtoService, 'addProdutoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      expect(produtoService.query).toHaveBeenCalled();
      expect(produtoService.addProdutoToCollectionIfMissing).toHaveBeenCalledWith(
        produtoCollection,
        ...additionalProdutos.map(expect.objectContaining),
      );
      expect(comp.produtosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pedido: IPedido = { id: 456 };
      const cliente: ICliente = { id: 8831 };
      pedido.cliente = cliente;
      const produto: IProduto = { id: 3183 };
      pedido.produtos = [produto];

      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      expect(comp.clientesSharedCollection).toContain(cliente);
      expect(comp.produtosSharedCollection).toContain(produto);
      expect(comp.pedido).toEqual(pedido);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPedido>>();
      const pedido = { id: 123 };
      jest.spyOn(pedidoFormService, 'getPedido').mockReturnValue(pedido);
      jest.spyOn(pedidoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pedido }));
      saveSubject.complete();

      // THEN
      expect(pedidoFormService.getPedido).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pedidoService.update).toHaveBeenCalledWith(expect.objectContaining(pedido));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPedido>>();
      const pedido = { id: 123 };
      jest.spyOn(pedidoFormService, 'getPedido').mockReturnValue({ id: null });
      jest.spyOn(pedidoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pedido: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pedido }));
      saveSubject.complete();

      // THEN
      expect(pedidoFormService.getPedido).toHaveBeenCalled();
      expect(pedidoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPedido>>();
      const pedido = { id: 123 };
      jest.spyOn(pedidoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pedidoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCliente', () => {
      it('Should forward to clienteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(clienteService, 'compareCliente');
        comp.compareCliente(entity, entity2);
        expect(clienteService.compareCliente).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareProduto', () => {
      it('Should forward to produtoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(produtoService, 'compareProduto');
        comp.compareProduto(entity, entity2);
        expect(produtoService.compareProduto).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
