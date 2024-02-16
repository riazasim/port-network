import { Component } from '@angular/core';
import { CompanyModel } from 'src/app/core/models/company.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  isActive: number = 1;
  companies: CompanyModel[] = [];
  onImgClick(number : number){
    this.isActive = number
  }
}
