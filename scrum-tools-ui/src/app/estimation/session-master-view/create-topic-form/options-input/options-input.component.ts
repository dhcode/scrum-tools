import { Component, forwardRef, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  UntypedFormArray,
  UntypedFormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-options-input',
  templateUrl: './options-input.component.html',
  styleUrls: ['./options-input.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OptionsInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: OptionsInputComponent, multi: true },
  ],
})
export class OptionsInputComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  private subs: Subscription;

  editing = false;

  options = new UntypedFormArray([]);

  disabled = false;

  focusIndex = null;

  @Output() editingTriggered = new EventEmitter<boolean>();

  private onChange = (v: number[]) => {};
  private onTouched = () => {};

  constructor() {}

  ngOnInit(): void {
    this.subs = this.options.valueChanges.subscribe((value) => {
      this.onTouched();
      this.onChange(
        value.map((v) => {
          if (v === '0') {
            return Number.NaN;
          }
          if (v === '?') {
            return 0;
          }
          return parseFloat(parseFloat(v).toFixed(1));
        }),
      );
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.disabled) {
      this.editing = false;
    }
  }

  writeValue(options: number[]): void {
    if (Array.isArray(options)) {
      if (this.options.length < options.length) {
        for (let i = this.options.length; i < options.length; i++) {
          this.options.push(new UntypedFormControl('', this.validateControl));
        }
      } else if (this.options.length > options.length) {
        for (let i = this.options.length; i >= options.length; i--) {
          this.options.removeAt(i);
        }
      }
      this.options.patchValue(
        options.map((o) => (o === 0 ? '?' : o.toString())),
        { emitEvent: false },
      );
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (Array.isArray(control.value)) {
      if (control.value.some((v, index, self) => isNaN(v) || v > 99 || v < 0 || self.indexOf(v) !== index)) {
        return {
          invalidOption: true,
        };
      }
      return null;
    } else {
      return {
        invalidOption: true,
      };
    }
  }

  addOption(afterIndex) {
    if (this.options.length < 20) {
      this.options.insert(afterIndex, new UntypedFormControl('', this.validateControl));
      this.focusIndex = afterIndex;
    }
  }

  removeOption(index) {
    if (this.options.length > 1) {
      this.options.removeAt(index);
    }
  }

  enableEditing() {
    this.editing = true;
    this.editingTriggered.emit(true);
  }

  validateControl(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (
      value !== '?' &&
      (isNaN(value) || value === '' || value === '0' || parseFloat(value) !== singleDecimal(value))
    ) {
      return {
        invalidNumber: true,
      };
    }
    return null;
  }
}

function singleDecimal(v: string): number {
  return parseFloat(parseFloat(v).toFixed(1));
}
