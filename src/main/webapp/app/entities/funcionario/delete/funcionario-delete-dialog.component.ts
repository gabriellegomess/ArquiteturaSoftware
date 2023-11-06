import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IFuncionario } from '../funcionario.model';
import { FuncionarioService } from '../service/funcionario.service';

@Component({
  standalone: true,
  templateUrl: './funcionario-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class FuncionarioDeleteDialogComponent {
  funcionario?: IFuncionario;

  constructor(
    protected funcionarioService: FuncionarioService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.funcionarioService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
