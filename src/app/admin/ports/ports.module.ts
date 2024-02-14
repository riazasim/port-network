import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PortsRoutingModule } from './ports-routing.module';
import { PortsComponent } from './ports.component';
import { PortsListComponent } from './ports-list/ports-list.component';
import { PortsAddEditComponent } from './ports-add-edit/ports-add-edit.component';
import { PortsDeleteModalComponent } from './ports-delete-modal/ports-delete-modal.component';
import { PortsSuccessComponent } from './ports-success/ports-success.component';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from '../../shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PortsImportModalComponent} from "./ports-import-modal/ports-import-modal.component";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import { NoPortsComponent } from './no-ports/no-ports.component';
import { PortAddContactModalComponent } from './ports-add-contact-modal/ports-add-contact-modal.component';

@NgModule({
  declarations: [
    PortsComponent,
    PortsListComponent,
    PortsAddEditComponent,
    PortsDeleteModalComponent,
    PortsSuccessComponent,
    NoPortsComponent,
    PortsImportModalComponent,
    PortAddContactModalComponent
  ],
    imports: [
        CommonModule,
        PortsRoutingModule,
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
export class PortsModule { }
