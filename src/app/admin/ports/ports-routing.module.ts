import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortsAddEditComponent } from './ports-add-edit/ports-add-edit.component';
import { PortsListComponent } from './ports-list/ports-list.component';
import { PortsSuccessComponent } from './ports-success/ports-success.component';
import { PortsComponent } from './ports.component';

const routes: Routes = [
  {
    path: '',
    component: PortsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: PortsListComponent
      },
      {
        path: 'success',
        component: PortsSuccessComponent
      },
      {
        path: 'add',
        component: PortsAddEditComponent
      },
      {
        path: 'edit/:id',
        component: PortsAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortsRoutingModule { }
