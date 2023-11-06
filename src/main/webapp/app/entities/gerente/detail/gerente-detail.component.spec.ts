import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GerenteDetailComponent } from './gerente-detail.component';

describe('Gerente Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenteDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: GerenteDetailComponent,
              resolve: { gerente: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(GerenteDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load gerente on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GerenteDetailComponent);

      // THEN
      expect(instance.gerente).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
