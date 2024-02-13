import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OnboardingSlideComponent } from './onboarding-slide/onboarding-slide.component';
import { OnboardingSlideshowComponent } from './onboarding-slideshow/onboarding-slideshow.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
  declarations: [OnboardingSlideComponent, OnboardingSlideshowComponent],
  imports: [CommonModule],
  exports: [OnboardingSlideComponent, OnboardingSlideshowComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OnboardingSlideModule {
}
