import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CompanyModel } from 'src/app/core/models/company.model';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from 'src/app/core/services/company.service';
@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})
export class SearchComponent {
    constructor(
        private readonly companyService: CompanyService,
        private readonly cd: ChangeDetectorRef) {
            this.retrieveCompanies();
         }

    isActive: number = 1;
    companies: CompanyModel[] = [];

    onImgClick(number: number) {
        this.isActive = number
    }

    retrieveCompanies(): void {

        let data={
            "start": 0,
            "length": 0,
            "filters": ["","","","",""],
            "order": [{"dir": "DESC", "column": 0}]
        }
        this.companyService.pagination(data).subscribe(response => {
            this.companies = response.items;
            this.cd.detectChanges();
        })
    }
}
