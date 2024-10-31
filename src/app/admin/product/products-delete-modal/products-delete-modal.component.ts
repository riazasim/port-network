import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-products-delete-modal',
  templateUrl: './products-delete-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsDeleteModalComponent {
  constructor(private readonly dialogRef: MatDialogRef<any>){}
  

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
