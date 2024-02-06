import { FormGroup } from '@angular/forms';

export function touchedOrDirty(form: FormGroup, campo: string): boolean {
  if (form.get(campo)?.touched || form.get(campo)?.dirty) return true;
  return false;
}
