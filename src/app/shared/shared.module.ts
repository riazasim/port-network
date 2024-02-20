import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconicInputWrapperComponent } from './components/input-wrapper/iconic-input-wrapper.component';
import { IconicPasswordWrapperComponent } from './components/password-wrapper/iconic-password-wrapper.component';
import { IconicSelectWrapperComponent } from './components/select-wrapper/iconic-select-wrapper.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SelectRefDirective } from './directives/select-ref.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';
import { FilterPipe } from "../core/pipes/filter.pipe";
import { SuccessContainerComponent } from "./components/success-container/success-container.component";
import { EditContainerComponent } from "./components/edit-container/edit-container.component";
import { FullEmptyContainerComponent } from "./components/full-empty-container/full-empty-container.component";
import { ChangeLocationModalComponent } from './components/change-location-modal/change-location-modal.component';
import { CallbackPipe } from '../core/pipes/callback.pipe';
import { SearchbarModule } from './components/searchbar/searchbar.component';
import { ButtonComponent } from './components/button/button.component';
import { FilterSelectComponent } from './components/filter-select/filter-select.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { TextareaWrapperComponent } from './components/textarea-wrapper/textarea-wrapper.component';
import { SVGLayoutComponent } from './components/svg-layout/svg-layout.component';
import { AutocompleteSelectComponent } from './components/autocomplete-select/autocomplete-select.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    IconicInputWrapperComponent,
    SVGLayoutComponent,
    IconicPasswordWrapperComponent,
    IconicSelectWrapperComponent,
    LoaderComponent,
    SelectRefDirective,
    PublicLayoutComponent,
    SuccessContainerComponent,
    FilterPipe,
    EditContainerComponent,
    FullEmptyContainerComponent,
    ChangeLocationModalComponent,
    CallbackPipe,
    ButtonComponent,
    FilterSelectComponent,
    TextareaWrapperComponent,
    AutocompleteSelectComponent,
  ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        SearchbarModule,
        MatProgressSpinnerModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatRadioModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatInputModule,
        MatSelectModule
    ],
  exports: [
    IconicInputWrapperComponent,
    SVGLayoutComponent,
    IconicPasswordWrapperComponent,
    IconicSelectWrapperComponent,
    LoaderComponent,
    SelectRefDirective,
    PublicLayoutComponent,
    FilterPipe,
    SuccessContainerComponent,
    EditContainerComponent,
    FullEmptyContainerComponent,
    ChangeLocationModalComponent,
    CallbackPipe,
    ButtonComponent,
    FilterSelectComponent,
    TextareaWrapperComponent,
    AutocompleteSelectComponent,
    AutocompleteSelectComponent,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class SharedModule { }
