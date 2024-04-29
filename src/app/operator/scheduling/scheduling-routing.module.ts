import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchedulingSuccessComponent } from './scheduling-success/scheduling-success.component';
import { SchedulingComponent } from './scheduling.component';
import { PlanningListComponent } from './planning-list/planning-list.component';
import { NoRestrictionsComponent } from './no-restrictions/no-restrictions.component';
import { RestrictionsComponent } from './restrictions/restrictions.component';

const routes: Routes = [
    {
        path: '',
        component: SchedulingComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'planning-list',
                component: PlanningListComponent
            },
            {
                path: 'no-restrictions',
                component: NoRestrictionsComponent
            },
            {
                path: 'restrictions',
                component: RestrictionsComponent
            },
            {
                path: 'success',
                component: SchedulingSuccessComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SchedulingRoutingModule { }
