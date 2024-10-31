import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LocationSettingsModel } from 'src/app/core/models/location-settings.model';
import { OrganizationService } from 'src/app/core/services/organization.service';

@Component({
  selector: 'app-location-settings',
  templateUrl: './location-settings.component.html',
  styleUrls: ['./location-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationSettingsComponent {
  userRole: string | null; 
  constructor(
    private readonly organizationService: OrganizationService,
  ){
    this.userRole = organizationService.getUserRole();
  }
}
