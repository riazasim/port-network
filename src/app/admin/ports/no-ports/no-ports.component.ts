import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'no-ports',
  templateUrl: './no-ports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoPortsComponent {}
