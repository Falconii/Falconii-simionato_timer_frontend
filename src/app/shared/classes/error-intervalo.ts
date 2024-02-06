export class ErrorIntervalo extends Error {
  constructor(messagem: string) {
    super(messagem);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ErrorIntervalo.prototype);
    this.name = 'MyExceptionIntervalo';
  }
  showError() {
    return this.message;
  }
}
