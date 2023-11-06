import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FuncionarioDetailComponent } from './funcionario-detail.component';

describe('Funcionario Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: FuncionarioDetailComponent,
              resolve: { funcionario: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(FuncionarioDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load funcionario on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', FuncionarioDetailComponent);

      // THEN
      expect(instance.funcionario).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
