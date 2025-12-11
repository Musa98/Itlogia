import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() control: AbstractControl | null = null;
  @Input() errorMessages: {[key: string]: string} = {};
  
  // Добавьте Input для контроля запрета точек
  @Input() disableDots: boolean = false;
  
  value: string = '';
  
  onChange: any = () => {};
  onTouched: any = () => {};
  
  ngOnInit(): void {
    if (this.control && this.control.value) {
      this.value = this.control.value;
    }
  }
  
  onInput(event: Event): void {
    let inputValue = (event.target as HTMLInputElement).value;
    
    // Удаляем точки если disableDots=true
    if (this.disableDots) {
      inputValue = this.removeDots(inputValue);
      (event.target as HTMLInputElement).value = inputValue;
    }
    
    this.value = inputValue;
    
    if (this.control) {
      this.control.setValue(inputValue);
      this.control.markAsTouched();
    }
    
    this.onChange(inputValue);
    this.onTouched();
  }
  
  // Обработчик нажатия клавиш
  onKeyDown(event: KeyboardEvent): void {
    // Запрещаем точку если disableDots=true
    if (this.disableDots && this.isDotKey(event)) {
      event.preventDefault();
      return;
    }
  }
  
  // Метод для удаления точек
  private removeDots(value: string): string {
    return value.replace(/\./g, '');
  }
  
  // Проверка на точку
  private isDotKey(event: KeyboardEvent): boolean {
    return event.key === '.' || event.key === 'Decimal';
  }
  
  showError(): boolean {
    return this.control !== null && this.control.invalid && this.control.touched;
  }
  
  getErrorMessage(): string {
    if (!this.control || !this.control.errors) return '';
    
    const firstError = Object.keys(this.control.errors)[0];
    return this.errorMessages[firstError] || 'Поле заполнено неверно';
  }
  
  writeValue(value: string): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}