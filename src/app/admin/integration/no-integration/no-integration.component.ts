import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'no-integration',
  templateUrl: './no-integration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoIntegrationComponent {}
