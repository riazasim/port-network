import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BerthsRoutingModule } from './berths-routing.module';
import { BerthsComponent } from './berths.component';
import { BerthsListComponent } from './berths-list/berths-list.component';
import { BerthsAddEditComponent } from './berths-add-edit/berths-add-edit.component';
import { BerthsDeleteModalComponent } from './berths-delete-modal/berths-delete-modal.component';
import { BerthsSuccessComponent } from './berths-success/berths-success.component';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from '../../shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BerthsImportModalComponent} from "./berths-import-modal/berths-import-modal.component";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import { NoBerthsComponent } from './no-berths/no-berths.component';

@NgModule({
  declarations: [
    BerthsComponent,
    BerthsListComponent,
    BerthsAddEditComponent,
    BerthsDeleteModalComponent,
    BerthsSuccessComponent,
    NoBerthsComponent,
    BerthsImportModalComponent
  ],
    imports: [
        CommonModule,
        BerthsRoutingModule,
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
export class BerthsModule { }
