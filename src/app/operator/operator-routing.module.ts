import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OperatorComponent } from './operator.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
    {
        path: '',
        component: OperatorComponent,
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
                path: 'scheduling',
                loadChildren: () => import('./scheduling/scheduling.module').then(m => m.SchedulingModule),
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OperatorRoutingModule { }
