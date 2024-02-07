import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-berths-delete-modal',
  templateUrl: './berths-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BerthsDeleteModalComponent {
  constructor(private readonly dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
