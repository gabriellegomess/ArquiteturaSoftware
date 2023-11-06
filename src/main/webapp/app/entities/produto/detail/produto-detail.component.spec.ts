import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProdutoDetailComponent } from './produto-detail.component';

describe('Produto Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ProdutoDetailComponent,
              resolve: { produto: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProdutoDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load produto on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProdutoDetailComponent);

      // THEN
      expect(instance.produto).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
