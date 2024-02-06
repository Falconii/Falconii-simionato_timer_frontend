import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[Setfocus]',
})
export class SetfocusDirective {
  @Input('Setfocus') isFocused: boolean = false;

  constructor(private hostElement: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (this.isFocused) {
      this.renderer.selectRootElement(this.hostElement.nativeElement).focus();
    }
  }
}
