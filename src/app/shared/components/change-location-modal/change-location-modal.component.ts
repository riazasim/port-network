import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-change-location-modal',
  templateUrl: './change-location-modal.component.html',
  styleUrls: ['./change-location-modal.component.scss']
})
export class ChangeLocationModalComponent {
  selectedLocations: number[] = [];
  search: string;
  id: number;
  constructor(private readonly dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log(data,'portsList')
    }

    
    selectLocation(index: number, id: number) {
      this.selectedLocations.length = 0;
      this.selectedLocations[index] = id;
      this.id = id;
    }

    cancel(): void {
      this.dialogRef.close(null);
    }

    confirm(): void {
      this.dialogRef.close(this.id);
    }
}
