import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GerenteService } from '../service/gerente.service';
import { IGerente } from '../gerente.model';
import { GerenteFormService } from './gerente-form.service';

import { GerenteUpdateComponent } from './gerente-update.component';

describe('Gerente Management Update Component', () => {
  let comp: GerenteUpdateComponent;
  let fixture: ComponentFixture<GerenteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gerenteFormService: GerenteFormService;
  let gerenteService: GerenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), GerenteUpdateComponent],
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
      .overrideTemplate(GerenteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GerenteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gerenteFormService = TestBed.inject(GerenteFormService);
    gerenteService = TestBed.inject(GerenteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const gerente: IGerente = { id: 456 };

      activatedRoute.data = of({ gerente });
      comp.ngOnInit();

      expect(comp.gerente).toEqual(gerente);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGerente>>();
      const gerente = { id: 123 };
      jest.spyOn(gerenteFormService, 'getGerente').mockReturnValue(gerente);
      jest.spyOn(gerenteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gerente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gerente }));
      saveSubject.complete();

      // THEN
      expect(gerenteFormService.getGerente).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gerenteService.update).toHaveBeenCalledWith(expect.objectContaining(gerente));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGerente>>();
      const gerente = { id: 123 };
      jest.spyOn(gerenteFormService, 'getGerente').mockReturnValue({ id: null });
      jest.spyOn(gerenteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gerente: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gerente }));
      saveSubject.complete();

      // THEN
      expect(gerenteFormService.getGerente).toHaveBeenCalled();
      expect(gerenteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGerente>>();
      const gerente = { id: 123 };
      jest.spyOn(gerenteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gerente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gerenteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
