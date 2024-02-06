import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[CorUltimosProjetos]',
})
export class CorUltimosProjetosDirective {
  @Input('cor') cor: string = 'red';
  @Input('last') last: number = 0;
  @Input('index') index: number = 0;

  constructor(private hostElement: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.setColor();
  }

  setColor() {
    if (this.index < this.last) {
      this.renderer.setStyle(this.hostElement.nativeElement, 'color', this.cor);
    }
  }
}
