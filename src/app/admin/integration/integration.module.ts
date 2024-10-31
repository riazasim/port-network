import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from '../../shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import { IntegrationAddEditComponent } from './integration-add-edit/integration-add-edit.component';
import { IntegrationDeleteModalComponent } from './integration-delete-modal/integration-delete-modal.component';
import { IntegrationImportModalComponent } from './integration-import-modal/integration-import-modal.component';
import { IntegrationListComponent } from './integration-list/integration-list.component';
import { IntegrationSuccessComponent } from './integration-success/integration-success.component';
import { NoIntegrationComponent } from './no-integration/no-integration.component';
import { IntegrationComponent } from './integration.component';
import { IntegrationRoutingModule } from './integration-routing.module';

@NgModule({
  declarations: [
    IntegrationComponent,
    IntegrationListComponent,
    IntegrationAddEditComponent,
    IntegrationDeleteModalComponent,
    IntegrationSuccessComponent,
    NoIntegrationComponent,
    IntegrationImportModalComponent
  ],
    imports: [
        CommonModule,
        IntegrationRoutingModule,
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
export class IntegrationModule { }
