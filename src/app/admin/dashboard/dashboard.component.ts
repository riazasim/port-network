import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { PartnerModel } from 'src/app/core/models/partner.model';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { PartnerService } from 'src/app/core/services/partner.service';
import { StatsService } from 'src/app/core/services/stats.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnDestroy  {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  totalVehiclesToday$: Observable<number>;
  totalVehiclesInside$: Observable<number>;
  totalVehiclesPlanned$: Observable<number>;
  lineChartData$: Observable<any>;
  currentVehicles$: Observable<any>;
  futureVehicles$: Observable<any>;

  clients$: BehaviorSubject<PartnerModel[]> = new BehaviorSubject<PartnerModel[]>([]);

  // Charts
  
  public readonly showLabels = true;
  public readonly animations = true;
  public readonly xAxis = true;
  public readonly yAxis = true;
  public readonly showYAxisLabel = true;
  public readonly showXAxisLabel = true;
  public readonly xAxisLabel = 'Hour';
  public readonly yAxisLabel = 'Vehicles today';
  public readonly timeline = true;

  readonly colorScheme: string | Color | any = {
    domain: ['#A10A28', '#BFEAF8' , '#7AA3E5', '#A27EA8']
  };

  readonly lineChartDataColorScheme: Color = {
    name: 'Line Chart Color Scheme',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['#ffa500', '#BFEAF8' , '#7AA3E5', '#A27EA8']
  }

  readonly showLegend$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public readonly legendPosition: LegendPosition = LegendPosition.Right;
  subscriberLocation: Subscription;

  public readonly lineChartData: { name: string, series: { name: string, value: number }[] }[] = [];
  public readonly pieChardData: { name: string, value: number }[] = [];
  public readonly view: [number, number] = [600, 280];
  public readonly gradient = true;
  constructor(private readonly bpo: BreakpointObserver,
              private readonly statService: StatsService,
              private readonly organizationService: OrganizationService,
              private readonly partnerService: PartnerService,
              private readonly router: Router,
              private readonly route: ActivatedRoute
  ) {}

   ngOnInit(): void {
    this.bpo.observe('(min-width:768px)')
      .subscribe({
        next: (bpState) => this.showLegend$.next(bpState.matches)
      });
      this.subscribeForLocationChanges();
      this.retrieveClients();
  }

  retrieveClients(): void {
    this.partnerService.list({}).subscribe((clients: PartnerModel[]) => {
      this.clients$.next(clients);
      this.isLoading$.next(false);
    })
  }

  subscribeForLocationChanges(): void {
    this.subscriberLocation = this.organizationService.organization.subscribe((locationData) => {
      if (locationData) {
        this.totalVehiclesToday$ = this.statService.getVehiclesToday()
        this.totalVehiclesInside$ = this.statService.getVehiclesInside()
        this.totalVehiclesPlanned$ = this.statService.getVehiclesPlanned()
        this.lineChartData$ = this.statService.getHourlyVehiclesToday();
        this.currentVehicles$ = this.statService.getVehiclesInsideByOperation();
        this.futureVehicles$ = this.statService.getVehiclesPlannedByOperation();
      }
    })
  }

  redirectToPartnerDetails(event: MatAutocompleteSelectedEvent): void {
    this.router.navigate(['../partners', 'edit', event.option.value.id], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.subscriberLocation.unsubscribe();
  }
}
