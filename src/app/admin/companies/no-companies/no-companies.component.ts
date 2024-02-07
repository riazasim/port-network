import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'no-companies',
  templateUrl: './no-companies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoCompaniesComponent {}
