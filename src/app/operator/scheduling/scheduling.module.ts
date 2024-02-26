import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';

import { SchedulingRoutingModule } from './scheduling-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchedulingComponent } from './scheduling.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { StatisticCardV2Module } from 'src/app/shared/components/cards/statistic-card-v2/statistic-card-v2.component';
import { RolePipesModule } from 'src/app/core/pipes/role-pipes.module';
import { SchedulingCardComponent } from './scheduling-card/scheduling-card.component';
import { SchedulingTableComponent } from './scheduling-table/scheduling-table.component';
import { AddSchedulingComponent } from './add-scheduling/add-scheduling.component';
import { SchedulingSuccessComponent } from './scheduling-success/scheduling-success.component';
import { SchedulingImportModalComponent } from './scheduling-import-modal/scheduling-import-modal.component';
import { SchedulingPlanModalComponent } from './scheduling-plan-modal/scheduling-plan-modal.component';
import { SchedulingEditPlanComponent } from './scheduling-edit-plan/scheduling-edit-plan.component';
import { SchedulingViewLogComponent } from './scheduling-view-log/scheduling-view-log.component';
import { MatIconModule } from '@angular/material/icon';
import { SchedulingSendMessageComponent } from './scheduling-send-message/scheduling-send-message.component';
import { SchedulingDeleteModalComponent } from './scheduling-delete-modal/scheduling-delete-modal.component';
import { VehicleModule } from '../vehicle/vehicle.module';
import { NoSchedulingComponent } from './no-scheduling/no-scheduling.component';
import { SchedulingAddProductModalComponent } from './scheduling-add-product-modal/scheduling-add-product-modal.component';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { MatChipsModule } from '@angular/material/chips';
import { EditSchedulingComponent } from './edit-scheduling/edit-scheduling.component';
import { SchedulingTableBoxComponent } from './scheduling-table-box/scheduling-table-box.component';
import { SchedulingUpgradeWarningModalComponent } from './scheduling-upgrade-warning-modal/scheduling-upgrade-warning-modal.component';
import { SchedulingCancelModalComponent } from './scheduling-cancel-modal/scheduling-cancel-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { SchedulingRejectModalComponent } from './scheduling-reject-modal/scheduling-reject-modal.component';
import { SchedulingCheckinCheckoutModalComponent } from './scheduling-checkin-checkout-modal/scheduling-checkin-checkout-modal.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollbarReachedModule } from 'ngx-scrollbar/reached-event';
import { SchedulingShowClientSupplierCardLabelsComponent } from './scheduling-show-client-supplier-card-labels/scheduling-show-client-supplier-card-labels.component';
import { SchedulingSearchBarComponent } from './scheduling-search-bar/scheduling-search-bar.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SchedulingComponent,
    SchedulingCardComponent,
    SchedulingTableComponent,
    AddSchedulingComponent,
    SchedulingSuccessComponent,
    SchedulingImportModalComponent,
    SchedulingPlanModalComponent,
    SchedulingEditPlanComponent,
    SchedulingViewLogComponent,
    SchedulingSendMessageComponent,
    SchedulingDeleteModalComponent,
    NoSchedulingComponent,
    SchedulingAddProductModalComponent,
    EditSchedulingComponent,
    SchedulingTableBoxComponent,
    SchedulingUpgradeWarningModalComponent,
    SchedulingCancelModalComponent,
    SchedulingRejectModalComponent,
    SchedulingCheckinCheckoutModalComponent,
    SchedulingShowClientSupplierCardLabelsComponent,
    SchedulingSearchBarComponent
  ],
  imports: [
    CommonModule,
    SchedulingRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    TranslateModule,
    MatStepperModule,
    MatBadgeModule,
    MatDialogModule,
    RolePipesModule,
    StatisticCardV2Module,
    FontAwesomeModule,
    SearchbarModule,
    SharedModule,
    DragDropModule,
    MatSidenavModule,
    MatIconModule,
    VehicleModule,
    MatMomentDateModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatDatepickerModule,
    MatChipsModule,
    MatTooltipModule,
    NgScrollbarModule,
    NgScrollbarReachedModule
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FORMATS }
  ]
})
export class SchedulingModule { }
