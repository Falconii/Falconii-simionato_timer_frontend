export class ControlePaginas {
  private paginaInicial: number;
  private paginaFinal: number;
  private paginaAtual: number;
  private totalPaginas: number;

  constructor(private tamPagina: number, private totalRegistros: number) {
    this.paginaInicial = 1;
    this.paginaFinal = 1;
    this.totalPaginas = 1;
    this.setTamPagina(this.tamPagina);
    this.paginaAtual = 1;
  }

  goFirst() {
    this.paginaAtual = this.paginaInicial;
    return this.paginaAtual;
  }

  goLast() {
    this.paginaAtual = this.paginaFinal;
    return this.paginaAtual;
  }

  nextPage() {
    this.paginaAtual++;
    if (this.paginaAtual > this.paginaFinal)
      this.paginaAtual = this.paginaFinal;
  }

  forwardPage() {
    this.paginaAtual--;
    if (this.paginaAtual < 1) this.paginaAtual = 1;
  }

  getPaginalAtual(): number {
    return this.paginaAtual;
  }
  getTotalPaginas(): number {
    return this.totalPaginas;
  }
  setTamPagina(value: number): void {
    this.tamPagina = value;
    let resto = this.totalRegistros % this.tamPagina;
    if (resto == 0) {
      this.totalPaginas = Math.trunc(this.totalRegistros / this.tamPagina);
    } else {
      this.totalPaginas = Math.trunc(this.totalRegistros / this.tamPagina) + 1;
    }
    this.paginaFinal = this.totalPaginas;
  }

  setPaginaAtual(value: number) {
    this.paginaAtual = value;
  }
}
