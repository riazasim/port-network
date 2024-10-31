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
import { AreaAddEditComponent } from './area-add-edit/area-add-edit.component';
import { AreaDeleteModalComponent } from './area-delete-modal/area-delete-modal.component';
import { AreaImportModalComponent } from './area-import-modal/area-import-modal.component';
import { AreaListComponent } from './area-list/area-list.component';
import { AreaRoutingModule } from './area-routing.module';
import { AreaSuccessComponent } from './area-success/area-success.component';
import { NoAreaComponent } from './no-area/no-area.component';
import { AreaComponent } from './area.component';

@NgModule({
  declarations: [
    AreaComponent,
    AreaListComponent,
    AreaAddEditComponent,
    AreaDeleteModalComponent,
    AreaSuccessComponent,
    NoAreaComponent,
    AreaImportModalComponent,
  ],
    imports: [
        CommonModule,
        AreaRoutingModule,
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
export class AreaModule { }
