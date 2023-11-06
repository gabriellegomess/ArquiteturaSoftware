import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPedido } from '../pedido.model';
import { PedidoService } from '../service/pedido.service';

@Component({
  standalone: true,
  templateUrl: './pedido-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PedidoDeleteDialogComponent {
  pedido?: IPedido;

  constructor(
    protected pedidoService: PedidoService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pedidoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
