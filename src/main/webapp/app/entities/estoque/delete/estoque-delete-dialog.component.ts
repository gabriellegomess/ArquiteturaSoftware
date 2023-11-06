import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEstoque } from '../estoque.model';
import { EstoqueService } from '../service/estoque.service';

@Component({
  standalone: true,
  templateUrl: './estoque-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EstoqueDeleteDialogComponent {
  estoque?: IEstoque;

  constructor(
    protected estoqueService: EstoqueService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.estoqueService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
