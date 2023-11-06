import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GerenteService } from '../service/gerente.service';

import { GerenteComponent } from './gerente.component';

describe('Gerente Management Component', () => {
  let comp: GerenteComponent;
  let fixture: ComponentFixture<GerenteComponent>;
  let service: GerenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'gerente', component: GerenteComponent }]),
        HttpClientTestingModule,
        GerenteComponent,
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
      .overrideTemplate(GerenteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GerenteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GerenteService);

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
    expect(comp.gerentes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to gerenteService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getGerenteIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getGerenteIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
