import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-ships-delete-modal',
  templateUrl: './ships-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipsDeleteModalComponent {
  constructor(private readonly dialogRef: MatDialogRef<any>) { }

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
