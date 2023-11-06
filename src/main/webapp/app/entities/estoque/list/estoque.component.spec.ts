import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EstoqueService } from '../service/estoque.service';

import { EstoqueComponent } from './estoque.component';

describe('Estoque Management Component', () => {
  let comp: EstoqueComponent;
  let fixture: ComponentFixture<EstoqueComponent>;
  let service: EstoqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'estoque', component: EstoqueComponent }]),
        HttpClientTestingModule,
        EstoqueComponent,
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
      .overrideTemplate(EstoqueComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstoqueComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EstoqueService);

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
    expect(comp.estoques?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to estoqueService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEstoqueIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEstoqueIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
