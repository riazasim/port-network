import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { BerthModel } from 'src/app/core/models/berth.model';
import { PortModel } from 'src/app/core/models/port.model';
import { BerthService } from 'src/app/core/services/berth.service';
import { PortService } from 'src/app/core/services/port.service';

@Component({
  selector: 'app-berths-add-edit',
  templateUrl: './berths-add-edit.component.html'
})
export class BerthsAddEditComponent implements OnInit {
  berthForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  berth$: BehaviorSubject<BerthModel|null> = new BehaviorSubject<BerthModel|null>(null);
  id: number;
  ports: PortModel[] = [];
  portList : any
  constructor(private fb: UntypedFormBuilder,
              private berthService: BerthService,
              private readonly portService: PortService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscribeForQueryParams();
    this.retrievePorts()
    // console.log(this.portList)
    // combineLatest([
    //     this.retrievePorts(),
    //   ])
    //   .subscribe(([portId]) => {
    //     this.ports = portId;
    //     console.log(this.ports,'ports')
    //     this.initForm();
    //     this.subscribeForPortChanges();
    //   //   this.filterName = this.filterName.bind(this);
    //     this.isLoading$.next(false);
    //   });
  }

  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.berthService.get(this.id).subscribe(async response => {
        this.initForm(response);
        this.berth$.next({...response })
        this.isLoading$.next(false);
      });
    } else {
      this.initForm();
      this.isLoading$.next(false);
    }
  }

  initForm(data: BerthModel = <BerthModel>{}): void {
    this.berthForm = this.fb.group({
      //berthIdId: this.fb.control(data?.id),
      name: this.fb.control(data?.name || '', [Validators.required]),
      addrCoordinates: this.fb.control(data?.addrCoordinates || '', [Validators.required]),
      portId: this.fb.control(data?.portId || '', [Validators.required]),
      length: this.fb.control(data?.length || '', [Validators.required]),
      width: this.fb.control(data?.width || '', [Validators.required]),
      depth: this.fb.control(data?.depth || '', [Validators.required]),
    });
  }

  subscribeForPortChanges(): void {
    this.berthForm.get('portId')?.valueChanges.subscribe((id: number) => {
      const port = this.ports.find(o => o.portId === +id);
      this.berthForm.get('portId')?.patchValue(port?.name);
    })
  }

  
  retrievePorts() {
        this.portService.pagination({
          "start": 0,
          "length": 0,
          "filters": ["","","","","","","","",""],
          "order": [{"dir": "DESC", "column": 0}]
      }).subscribe(response =>{
        console.log(response)
        this.portList = response.items
        console.log(this.portList)
      })
      }

  saveBerth(): void {
    this.isLoading$.next(true);
    if (this.id) {
      this.berthService.edit(this.id,this.parseData(this.berthForm.value)).subscribe(() => {
        this.isLoading$.next(false);
        this.router.navigate(['../../success'], { relativeTo: this.route });
      });
    } else {
      this.berthService.create(this.parseData(this.berthForm.value)).subscribe(() => {
        this.isLoading$.next(false);
        this.router.navigate(['../success'], { relativeTo: this.route });
      });
    }
  }

  private parseData(data: BerthModel): BerthModel {
    if (!data.berthId) delete data.berthId;
    return data;
  }
}
