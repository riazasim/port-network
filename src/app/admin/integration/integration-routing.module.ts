import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegrationAddEditComponent } from './integration-add-edit/integration-add-edit.component';
import { IntegrationListComponent } from './integration-list/integration-list.component';
import { IntegrationSuccessComponent } from './integration-success/integration-success.component';
import { IntegrationComponent } from './integration.component';

const routes: Routes = [
  {
    path: '',
    component: IntegrationComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: IntegrationListComponent
      },
      {
        path: 'success',
        component: IntegrationSuccessComponent
      },
      {
        path: 'add',
        component: IntegrationAddEditComponent
      },
      {
        path: 'edit/:id',
        component: IntegrationAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationRoutingModule { }
