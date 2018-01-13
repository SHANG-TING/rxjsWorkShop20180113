import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  get phones(): FormArray { return this.form.get('phones') as FormArray; }

  form = this._fb.group({
    firstName: [{ value: '123', disabled: true }],
    lastName: [undefined, [Validators.required]],
    phones: this._fb.array([
      this.getPhoneControl()
    ])
  });

  constructor(private _fb: FormBuilder) { }

  private getPhoneControl() {
    return this._fb.control(undefined, [
      Validators.required,
      Validators.pattern(/^[09]{2}[0-9]{8}$/)
    ]);
  }

  addPhone(): void {
    this.phones.push(this.getPhoneControl());
  }

  removePhone(index: number): void {
    this.phones.removeAt(index);
  }

  submit(): void {

  }

}
