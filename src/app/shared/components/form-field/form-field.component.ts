import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ],
  templateUrl: './form-field.component.html'
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' = 'text';
  @Input() error?: string | null;
  @Input() helperText?: string;
  @Input() required: boolean = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() rows = 4;
  @Input() hasIcon = false;
  @Input() id = `form-field-${Math.random().toString(36).substr(2, 9)}`;

  value = '';
  showError = false;
  private touched = false;

  // ControlValueAccessor methods
  private onChange = (value: string) => { };
  private onTouched = () => { };

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get inputClasses(): string {
    const baseClasses = 'block w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500';
    const paddingClasses = this.hasIcon ? 'pl-10 pr-3 py-2' : 'px-3 py-2';
    const stateClasses = this.error && this.showError
      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700';
    const textClasses = 'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400';
    const disabledClasses = this.disabled ? 'opacity-50 cursor-not-allowed' : '';

    return `${baseClasses} ${paddingClasses} ${stateClasses} ${textClasses} ${disabledClasses}`;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.touched = true;
    this.showError = this.touched && !!this.error;
    this.onTouched();
  }

  onFocus(): void {
    this.showError = false;
  }
}