import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';
import { PlanningService } from 'src/app/core/services/planning.service';
import { OpenImageModalComponent } from 'src/app/shared/components/open-image-modal/open-image-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleSuccess } from 'src/app/shared/utils/success-handling.function';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { RolesService } from 'src/app/core/services/roles.service';
import { OrganizationService } from 'src/app/core/services/organization.service';

@Component({
    selector: 'assign-ports-modal',
    templateUrl: './assign-ports-modal.component.html',
    styleUrls: ['./assign-ports-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('slideOut', [
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateX(-100%)' }))
            ])
        ]),
        trigger('slideIn', [
            transition(':enter', [
                style({ transform: 'translateX(-100%)' }),
                animate('200ms ease-in', style({ transform: 'translateX(0%)' }))
            ])
        ])
    ]
})
export class AssignPortsModalComponent implements OnChanges {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    @Input() id: number;
    @Input() modal: string;
    @Input() sidenav: MatSidenav;
    @Input() planning: any;
    userIds: any[] = [];
    shipmentLogs: any[];
    step$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
    displayedColumns: string[] = ['select', 'name'];
    transferData: any[];
    dataSource: MatTableDataSource<any>
    selection: any;
    userRole: string;
    selectedRole: string;
    trasnportmode: any

    constructor(
        private readonly planningService: PlanningService,
        private readonly dialog: MatDialog,
        private readonly snackBar: MatSnackBar,
        private readonly roleService: RolesService,
        private readonly organizationService: OrganizationService,
    ) {}

    ngOnChanges(): void {
            this.retrieveLogHistory();
    }

    onRoleSelect(userRole: string): void {
        this.isLoading$.next(true)
        const data = {
            "planningId": this.id,
            "userRole": userRole
        }
        this.planningService.getTransferData(data).subscribe((response: any) => {
            this.isLoading$.next(false)
            this.step$.next(2)
            this.transferData = response.data.attributes;
            this.dataSource = new MatTableDataSource<any>(this.transferData);
            // console.log('transfer',this.dataSource)
            this.selection = this.transferData;
        })
    }

    retrieveLogHistory(): void {
        console.log(this.planning , this.trasnportmode)
    //     this.planningService.convoyLogs(this.id).subscribe(response => {
    //         let  logData;
    // //   debugger
    //     if (this.trasnportmode === 1) {
    //         logData = response[0]?.attributes;
    //     } 
    //     else if (this.trasnportmode === 2) {
    //         logData = response[0]?.attributes;
    //     } 
    //     else if (this.trasnportmode === 3) {
    //         logData = response[0]?.attributes;
    //     }

    //     if (logData) {
    //         this.planning = logData;
    //         this.isLoading$.next(false);
    //     } else {
    //         console.error("No log data found for the selected transport mode.");
    //     }
    // });
    }
    onUserSelect(id: any): void {
        if (!this.userIds) {
            this.userIds = [];
        }

        const index = this.userIds.indexOf(id);
        if (index === -1) {
            this.userIds.push(id);
        } else {
            this.userIds.splice(index, 1);
        }
    }

    onAssign(): void {
        this.isLoading$.next(true)
        this.planningService.assignPorts({
            "userId": this.id,
            "portIds": this.userIds
        }).subscribe({
            next: () => {
                this.isLoading$.next(false)
                this.step$.next(1);
                handleSuccess(this.snackBar, { message: "Assigned successfully" }, this.isLoading$);
            },
            error: (body) => {
                this.isLoading$.next(false)
                this.step$.next(1)
                handleError(this.snackBar, body, this.isLoading$);
            }
        })
    }

}

