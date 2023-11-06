import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FuncionarioService } from '../service/funcionario.service';

import { FuncionarioComponent } from './funcionario.component';

describe('Funcionario Management Component', () => {
  let comp: FuncionarioComponent;
  let fixture: ComponentFixture<FuncionarioComponent>;
  let service: FuncionarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'funcionario', component: FuncionarioComponent }]),
        HttpClientTestingModule,
        FuncionarioComponent,
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
      .overrideTemplate(FuncionarioComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FuncionarioComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FuncionarioService);

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
    expect(comp.funcionarios?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to funcionarioService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFuncionarioIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFuncionarioIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
