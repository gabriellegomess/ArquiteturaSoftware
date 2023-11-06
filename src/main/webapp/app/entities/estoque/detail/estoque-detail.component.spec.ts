import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EstoqueDetailComponent } from './estoque-detail.component';

describe('Estoque Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstoqueDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EstoqueDetailComponent,
              resolve: { estoque: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EstoqueDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load estoque on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EstoqueDetailComponent);

      // THEN
      expect(instance.estoque).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
