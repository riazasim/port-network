import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ports-delete-modal',
  templateUrl: './ports-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortsDeleteModalComponent {
  constructor(private readonly dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
