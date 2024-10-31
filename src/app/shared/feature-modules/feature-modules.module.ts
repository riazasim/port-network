import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulingSearchBarComponent } from 'src/app/operator/scheduling/scheduling-search-bar/scheduling-search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatMenuModule } from '@angular/material/menu';
import { SchedulingEditPlanComponent } from 'src/app/operator/scheduling/scheduling-edit-plan/scheduling-edit-plan.component';
import { SchedulingViewLogComponent } from 'src/app/operator/scheduling/scheduling-view-log/scheduling-view-log.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from '../shared.module';
import { SchedulingTableComponent } from 'src/app/operator/scheduling/scheduling-table/scheduling-table.component';
import { CdkTableModule } from '@angular/cdk/table';
import { MatChipsModule } from '@angular/material/chips';



@NgModule({
  declarations: [
    SchedulingSearchBarComponent,
    SchedulingEditPlanComponent,
    SchedulingViewLogComponent,
    SchedulingTableComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    FontAwesomeModule,
    MatMenuModule,
    MatDatepickerModule,
    SharedModule,
    CdkTableModule,
    DragDropModule,
    MatChipsModule
  ],
  exports: [
    SchedulingSearchBarComponent,
    SchedulingEditPlanComponent,
    SchedulingViewLogComponent,
    SchedulingTableComponent
  ]
})
export class FeatureModulesModule { }
