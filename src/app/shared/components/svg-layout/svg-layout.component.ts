import { Component, ContentChild, Input } from '@angular/core';
import { InputRefDirective } from '../../directives/input-ref.directive';
import { GenericWrapperComponent } from '../generic-wrapper/generic-wrapper.component';


@Component({
  selector: '[svg-layout]',
  templateUrl: './svg-layout.component.html'
})
export class SVGLayoutComponent extends GenericWrapperComponent<HTMLInputElement, InputRefDirective>{

  // @Input()
  // public rightIcon: IconProp | undefined;

  // @Input()
  // public leftSvg: string | undefined;

  @Input()
  public layoutSvg: string | undefined;

  @ContentChild(InputRefDirective)
  override set inputRef(ref: InputRefDirective) {
    this._inputRef = ref;
  }

}
