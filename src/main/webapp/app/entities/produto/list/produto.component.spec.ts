import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProdutoService } from '../service/produto.service';

import { ProdutoComponent } from './produto.component';

describe('Produto Management Component', () => {
  let comp: ProdutoComponent;
  let fixture: ComponentFixture<ProdutoComponent>;
  let service: ProdutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'produto', component: ProdutoComponent }]),
        HttpClientTestingModule,
        ProdutoComponent,
      ],
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
      .overrideTemplate(ProdutoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProdutoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProdutoService);

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
    expect(comp.produtos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to produtoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProdutoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProdutoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
