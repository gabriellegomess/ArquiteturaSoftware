import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IGerente } from 'app/entities/gerente/gerente.model';
import { GerenteService } from 'app/entities/gerente/service/gerente.service';
import { FuncionarioService } from '../service/funcionario.service';
import { IFuncionario } from '../funcionario.model';
import { FuncionarioFormService } from './funcionario-form.service';

import { FuncionarioUpdateComponent } from './funcionario-update.component';

describe('Funcionario Management Update Component', () => {
  let comp: FuncionarioUpdateComponent;
  let fixture: ComponentFixture<FuncionarioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let funcionarioFormService: FuncionarioFormService;
  let funcionarioService: FuncionarioService;
  let gerenteService: GerenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), FuncionarioUpdateComponent],
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
      .overrideTemplate(FuncionarioUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FuncionarioUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    funcionarioFormService = TestBed.inject(FuncionarioFormService);
    funcionarioService = TestBed.inject(FuncionarioService);
    gerenteService = TestBed.inject(GerenteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Gerente query and add missing value', () => {
      const funcionario: IFuncionario = { id: 456 };
      const gerente: IGerente = { id: 23232 };
      funcionario.gerente = gerente;

      const gerenteCollection: IGerente[] = [{ id: 12 }];
      jest.spyOn(gerenteService, 'query').mockReturnValue(of(new HttpResponse({ body: gerenteCollection })));
      const additionalGerentes = [gerente];
      const expectedCollection: IGerente[] = [...additionalGerentes, ...gerenteCollection];
      jest.spyOn(gerenteService, 'addGerenteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ funcionario });
      comp.ngOnInit();

      expect(gerenteService.query).toHaveBeenCalled();
      expect(gerenteService.addGerenteToCollectionIfMissing).toHaveBeenCalledWith(
        gerenteCollection,
        ...additionalGerentes.map(expect.objectContaining),
      );
      expect(comp.gerentesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const funcionario: IFuncionario = { id: 456 };
      const gerente: IGerente = { id: 5930 };
      funcionario.gerente = gerente;

      activatedRoute.data = of({ funcionario });
      comp.ngOnInit();

      expect(comp.gerentesSharedCollection).toContain(gerente);
      expect(comp.funcionario).toEqual(funcionario);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFuncionario>>();
      const funcionario = { id: 123 };
      jest.spyOn(funcionarioFormService, 'getFuncionario').mockReturnValue(funcionario);
      jest.spyOn(funcionarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ funcionario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: funcionario }));
      saveSubject.complete();

      // THEN
      expect(funcionarioFormService.getFuncionario).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(funcionarioService.update).toHaveBeenCalledWith(expect.objectContaining(funcionario));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFuncionario>>();
      const funcionario = { id: 123 };
      jest.spyOn(funcionarioFormService, 'getFuncionario').mockReturnValue({ id: null });
      jest.spyOn(funcionarioService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ funcionario: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: funcionario }));
      saveSubject.complete();

      // THEN
      expect(funcionarioFormService.getFuncionario).toHaveBeenCalled();
      expect(funcionarioService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFuncionario>>();
      const funcionario = { id: 123 };
      jest.spyOn(funcionarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ funcionario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(funcionarioService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareGerente', () => {
      it('Should forward to gerenteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(gerenteService, 'compareGerente');
        comp.compareGerente(entity, entity2);
        expect(gerenteService.compareGerente).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
