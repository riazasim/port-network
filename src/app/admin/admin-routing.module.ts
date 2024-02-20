import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { BrandingComponent } from "./branding/branding.component";
import { LocationSettingsComponent } from "./location-settings/location-settings.component";
import { AdminComponent } from "./admin.component";
import { MapComponent } from './map/map.component';
import { SearchComponent } from './map/search/search.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'map',
        component: MapComponent
      },
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path: 'branding',
        component: BrandingComponent
      },
      {
        path: 'location-settings',
        component: LocationSettingsComponent
      },
      {
        path: 'fleet',
        loadChildren: () => import('./fleet/fleet.module').then(m => m.FleetModule),
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'ports',
        loadChildren: () => import('./ports/ports.module').then(m => m.PortsModule),
      },
      {
        path: 'berths',
        loadChildren: () => import('./berths/berths.module').then(m => m.BerthsModule),
      },
      {
        path: 'companies',
        loadChildren: () => import('./companies/companies.module').then(m => m.CompaniesModule),
      },
      {
        path: 'list-management',
        loadChildren: () => import('./list-management/list-management.module').then(m => m.ListManagementModule),
      },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
