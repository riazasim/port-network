import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BerthsAddEditComponent } from './berths-add-edit/berths-add-edit.component';
import { BerthsListComponent } from './berths-list/berths-list.component';
import { BerthsComponent } from './berths.component';
import { BerthsSuccessComponent } from './berths-success/berths-success.component';

const routes: Routes = [
  {
    path: '',
    component: BerthsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: BerthsListComponent
      },
      {
        path: 'success',
        component: BerthsSuccessComponent
      },
      {
        path: 'add',
        component: BerthsAddEditComponent
      },
      {
        path: 'edit/:id',
        component: BerthsAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BerthsRoutingModule { }
