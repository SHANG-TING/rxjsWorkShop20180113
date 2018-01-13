import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';
import { tap, map, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'app';

  newsletterList = [
    { id: 'subscribeRxWorkshop', name: 'Rx Workshop' },
    { id: 'subscribeAngularMaterial', name: 'Angular Material完全攻略' },
    { id: 'subscribeAngularTutorial', name: 'Angular入門速成班' },
    { id: 'subscribeAngularMaster', name: 'Angular大師養成班' }
  ];

  get phones(): FormArray { return this.form.get('phones') as FormArray; }

  form = this._fb.group({
    firstName: [{ value: '123', disabled: true }],
    lastName: [undefined],
    phones: this._fb.array([
      this.getPhoneControl()
    ]),
    subscription: new FormGroup({
      checkboxAll: new FormControl(false),
      subscribeRxWorkshop: new FormControl(false),
      subscribeAngularMaterial: new FormControl(false),
      subscribeAngularTutorial: new FormControl(false),
      subscribeAngularMaster: new FormControl(false)
    })
  });

  indeterminateSubscription = false;

  destory$ = new Subject();

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  ngOnInit(): void {
    this.form.get('subscription.checkboxAll').valueChanges.pipe(
      tap((value: boolean) => {
        this.newsletterList.forEach(newsletter => {
          this.form.get(`subscription.${newsletter.id}`).setValue(value);
        });
      }),
      takeUntil(this.destory$)
    ).subscribe();

    this.form.get('subscription').valueChanges.pipe(
      map((value: string[]) => Object.keys(value)),
      map((arKeys: string[]) => arKeys.filter(key => key !== 'checkboxAll')),
      map((arKeys: string[]) => {
        return arKeys.map(key => this.form.get(`subscription.${key}`).value).filter(x => x).length;
      }),
      this.settingContorls(),
      takeUntil(this.destory$)
    ).subscribe();
  }

  settingContorls() {
    return obs => obs.pipe(
      this.settingChkAll(),
      this.settingLastNameValidator()
    );
  }

  settingChkAll() {
    return obs => obs.pipe(
      tap(sum => {
        const chkall = this.form.get('subscription.checkboxAll');
        chkall.patchValue(sum === this.newsletterList.length, { emitEvent: false });
        this.indeterminateSubscription = (sum > 0 && sum < this.newsletterList.length);
      })
    );
  }

  settingLastNameValidator() {
    return obs => obs.pipe(
      tap(sum => {
        const lastName = this.form.get('lastName');
        if (sum > 1) {
          lastName.setValidators([Validators.required]);
        } else {
          lastName.clearValidators();
        }
        lastName.updateValueAndValidity();
      })
    );
  }


  get checkAll() {
        // console.log('a');
        const subscriptionCount = this._getSubscriptionCount();
    return subscriptionCount === this.newsletterList.length;
  }


  // get indeterminateSubscription() {
  //       console.log('a');
  //       const subscriptionCount = this._getSubscriptionCount();
  //   return subscriptionCount !== 0 && subscriptionCount !== this.newsletterList.length;
  // }


  private _getSubscriptionCount() {
    let subscriptionCount = 0;
    const subscriptionControls = (this.form.controls.subscription as FormGroup).controls;
    Object.keys(subscriptionControls)
      .filter(contorlKey => contorlKey !== 'checkboxAll')
      .forEach(contorlKey => {
      subscriptionCount += subscriptionControls[contorlKey].value ? 1 : 0;
    });
    return subscriptionCount;
  }

  subscribeAllChange($event: MatCheckboxChange) {
    this.newsletterList.forEach(newsletter => {
      this.form.get(`subscription.${newsletter.id}`).setValue($event.checked);
    });
  }

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

  constructor(private _fb: FormBuilder) { }

}
