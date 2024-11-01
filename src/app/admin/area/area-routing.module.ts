import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaAddEditComponent } from './area-add-edit/area-add-edit.component';
import { AreaListComponent } from './area-list/area-list.component';
import { AreaSuccessComponent } from './area-success/area-success.component';
import { AreaComponent } from './area.component';

const routes: Routes = [
  {
    path: '',
    component: AreaComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: AreaListComponent
      },
      {
        path: 'success',
        component: AreaSuccessComponent
      },
      {
        path: 'add',
        component: AreaAddEditComponent
      },
      {
        path: 'edit/:id',
        component: AreaAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaRoutingModule { }
