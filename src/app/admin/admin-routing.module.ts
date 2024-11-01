import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandingComponent } from "./branding/branding.component";
import { LocationSettingsComponent } from "./location-settings/location-settings.component";
import { AdminComponent } from "./admin.component";


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
                path: 'integrations',
                loadChildren: () => import('./integrations/integration.module').then(m => m.IntegrationModule),
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
                path: 'products',
                loadChildren: () => import('./product/products.module').then(m => m.ProductsModule),
              },
            {
                path: 'area',
                loadChildren: () => import('./area/area.module').then(m => m.AreaModule),
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
