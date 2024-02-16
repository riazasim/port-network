import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesAddEditComponent } from './companies-add-edit/companies-add-edit.component';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { CompaniesSuccessComponent } from './companies-success/companies-success.component';
import { CompaniesComponent } from './companies.component';
import { NoCompaniesComponent } from './no-companies/no-companies.component';

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
        path: 'no-companies',
        component: NoCompaniesComponent
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
