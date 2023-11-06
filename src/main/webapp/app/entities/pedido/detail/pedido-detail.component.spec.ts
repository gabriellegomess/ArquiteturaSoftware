import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PedidoDetailComponent } from './pedido-detail.component';

describe('Pedido Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PedidoDetailComponent,
              resolve: { pedido: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PedidoDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load pedido on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PedidoDetailComponent);

      // THEN
      expect(instance.pedido).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
