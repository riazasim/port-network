import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'no-area',
  templateUrl: './no-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoAreaComponent {}
