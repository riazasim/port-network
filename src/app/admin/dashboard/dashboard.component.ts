import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { BehaviorSubject, Observable } from 'rxjs';
import { StatsService } from 'src/app/core/services/stats.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent  {
  // readonly totalVehiclesToday$: Observable<number> = this.statService.getVehiclesToday()
  // readonly totalVehiclesInside$: Observable<number> = this.statService.getVehiclesInside()
  // readonly totalVehiclesPlanned$: Observable<number> = this.statService.getVehiclesPlanned()
  // readonly lineChartData$: Observable<any> = this.statService.getHourlyVehiclesToday();
  // readonly currentVehicles$: Observable<any> = this.statService.getVehiclesInsideByOperation();
  // readonly futureVehicles$: Observable<any> = this.statService.getVehiclesPlannedByOperation();
  //
  // // Charts
  //
  // public readonly showLabels = true;
  // public readonly animations = true;
  // public readonly xAxis = true;
  // public readonly yAxis = true;
  // public readonly showYAxisLabel = true;
  // public readonly showXAxisLabel = true;
  // public readonly xAxisLabel = 'Hour';
  // public readonly yAxisLabel = 'Vehicles today';
  // public readonly timeline = true;
  //
  // readonly colorScheme: string | Color | any = {
  //   domain: ['#A10A28', '#BFEAF8' , '#7AA3E5', '#A27EA8']
  // };
  //
  // readonly lineChartDataColorScheme: Color = {
  //   name: 'Line Chart Color Scheme',
  //   selectable: true,
  //   group: ScaleType.Linear,
  //   domain: ['#ffa500', '#BFEAF8' , '#7AA3E5', '#A27EA8']
  // }
  //
  // readonly showLegend$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  // public readonly legendPosition: LegendPosition = LegendPosition.Right;
  //
  // public readonly lineChartData: { name: string, series: { name: string, value: number }[] }[] = [];
  // public readonly pieChardData: { name: string, value: number }[] = [];
  // public readonly view: [number, number] = [600, 280];
  // public readonly gradient = true;
  // constructor(private readonly bpo: BreakpointObserver,
  //             private readonly statService: StatsService
  // ) {}

   ngOnInit(): void {
    // this.bpo.observe('(min-width:768px)')
    //   .subscribe({
    //     next: (bpState) => this.showLegend$.next(bpState.matches)
    //   });
  }
}
