import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-autocomplete-select',
  templateUrl: './autocomplete-select.component.html',
  styleUrls: ['./autocomplete-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteSelectComponent implements OnInit {
  @Input() list: any[];
  @Input() icon: IconProp|undefined;
  @Input() placeholder: string;
  @Input() searchField: string;
  @Input() selectedId: number|string;
  @Input() requireSelection: boolean;
  @Input() hideArrow: boolean;
  @Output() readonly optionSelected: EventEmitter<any> = new EventEmitter();

  selectControl: FormControl = new FormControl<any|null>('');
  selectableEntities$: Observable<any[]>;
  constructor() {
    this.displayFn = this.displayFn.bind(this);
    this.selectValue = this.selectValue.bind(this);
  }

  ngOnInit(): void {
    this.selectableEntities$ = this.selectControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value[this.searchField];
        return name ? this.filter(this.list, name) : this.list.slice();
      }),
    );

    if (this.selectedId) {
      this.selectValue(this.selectedId);
    }
  }

  checkForEmptyValue(event: Event): void {
    const value = (<HTMLInputElement>event.target).value;

    if (!value) {
      this.optionSelected.emit({ option: { value: { id: null }}});
      this.selectableEntities$ = this.selectControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value[this.searchField];
          return name ? this.filter(this.list, name) : this.list.slice();
        }),
      );
    }
  }

  selectValue(id: number|string): void {
    const entity = this.list.find(e => e.id === id);

    this.selectControl.setValue(entity);
  }
  
  displayFn(entity: any): string {
    return entity && entity[this.searchField] ? entity[this.searchField] : '';
  }

  private filter(list: any[], name: string): any[] {
    const filterValue = name.toLowerCase();

    return list.filter(option => option[this.searchField].toLowerCase().includes(filterValue));
  }
}
