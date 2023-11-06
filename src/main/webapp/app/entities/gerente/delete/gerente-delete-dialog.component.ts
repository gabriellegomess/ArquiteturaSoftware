import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IGerente } from '../gerente.model';
import { GerenteService } from '../service/gerente.service';

@Component({
  standalone: true,
  templateUrl: './gerente-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GerenteDeleteDialogComponent {
  gerente?: IGerente;

  constructor(
    protected gerenteService: GerenteService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gerenteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
