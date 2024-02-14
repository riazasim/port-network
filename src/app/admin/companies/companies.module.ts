import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesComponent } from './companies.component';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { CompaniesAddEditComponent } from './companies-add-edit/companies-add-edit.component';
import { CompaniesDeleteModalComponent } from './companies-delete-modal/companies-delete-modal.component';
import { CompaniesSuccessComponent } from './companies-success/companies-success.component';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from '../../shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CompaniesImportModalComponent} from "./companies-import-modal/companies-import-modal.component";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import { NoCompaniesComponent } from './no-companies/no-companies.component';
import { CompanyAddContactModalComponent } from './companies-add-contact-modal/companies-add-contact-modal.component';

@NgModule({
  declarations: [
    CompaniesComponent,
    CompaniesListComponent,
    CompaniesAddEditComponent,
    CompaniesDeleteModalComponent,
    CompaniesSuccessComponent,
    NoCompaniesComponent,
    CompaniesImportModalComponent,
    CompanyAddContactModalComponent,
  ],
    imports: [
        CommonModule,
        CompaniesRoutingModule,
        NgScrollbarModule,
        ReactiveFormsModule,
        FormsModule,
        CdkTableModule,
        MatPaginatorModule,
        MatSortModule,
        MaterialPanelTableModule,
        SearchbarModule,
        SharedModule,
        FontAwesomeModule,
        MatButtonToggleModule,
        MatMenuModule,
        MatTooltipModule
    ]
})
export class CompaniesModule { }
