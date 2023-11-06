import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PedidoService } from '../service/pedido.service';

import { PedidoComponent } from './pedido.component';

describe('Pedido Management Component', () => {
  let comp: PedidoComponent;
  let fixture: ComponentFixture<PedidoComponent>;
  let service: PedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'pedido', component: PedidoComponent }]), HttpClientTestingModule, PedidoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(PedidoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PedidoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PedidoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.pedidos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to pedidoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPedidoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPedidoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
