import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClienteDetailComponent } from './cliente-detail.component';

describe('Cliente Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ClienteDetailComponent,
              resolve: { cliente: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ClienteDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load cliente on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ClienteDetailComponent);

      // THEN
      expect(instance.cliente).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
