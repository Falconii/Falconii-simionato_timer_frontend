import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[CorStatusProj]',
})
export class CorStatusProjDirective {
  @Input('CorStatusProj') tipo: string = '';
  @Input('nivel') nivel: number = 0;

  constructor(private hostElement: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.setColor();
  }

  setColor() {
    /* revisar no fim do projeto */
    let cor: string = 'white';
    if (this.tipo == 'P') {
      switch (this.nivel) {
        case 1:
          cor = 'green';
          break;
        case 2:
          cor = 'yellow';
          break;
        case 3:
          cor = 'red';
          break;
        case 4:
          cor = 'black';
          break;
        default:
          cor = 'white';
          break;
      }
    } else {
      switch (this.nivel) {
        case 1:
          cor = 'green';
          break;
        case 2:
          cor = 'yellow';
          break;
        case 3:
          cor = 'red';
          break;
        case 4:
          cor = 'black';
          break;
        default:
          cor = 'white';
          break;
      }
    }
    this.renderer.setStyle(
      this.hostElement.nativeElement,
      'background-color',
      cor
    );
  }
}
