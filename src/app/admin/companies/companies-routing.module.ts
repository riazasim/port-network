import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesAddEditComponent } from './companies-add-edit/companies-add-edit.component';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { CompaniesSuccessComponent } from './companies-success/companies-success.component';
import { CompaniesComponent } from './companies.component';

const routes: Routes = [
  {
    path: '',
    component: CompaniesComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: CompaniesListComponent
      },
      {
        path: 'success',
        component: CompaniesSuccessComponent
      },
      {
        path: 'add',
        component: CompaniesAddEditComponent
      },
      {
        path: 'edit/:id',
        component: CompaniesAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }
