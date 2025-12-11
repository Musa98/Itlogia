import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { delay, Observable, of, tap } from 'rxjs';

import { HeaderComponent } from "./shared/header/header.component";
import { ButtonComponent } from "./shared/button/button.component";
import { PizzaCardComponent } from "./shared/pizza-card/pizza-card.component";
import { InputComponent } from "./shared/input/input.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent, 
    ButtonComponent, 
    PizzaCardComponent, 
    CommonModule, 
    InputComponent, 
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'itlogia';

  selectedPizza: any = null;
  isFullscreenMode = false;

  @ViewChild('fullscreenContainer') fullscreenContainer!: ElementRef;

  pizzas = [
    {
      img: 'assets/images/pizza1.png',
      title: 'Мясная Делюкс',
      ingridietns: 'Пепперони, лук, бекон, томатная паста, колбаски, перец, грибы, соус чили, ананасы'
    },
    {
      img: 'assets/images/pizza2.png',
      title: 'Морская Премиум',
      ingridietns: 'Перец, сыр, креветки, кальмары, мидии, лосось'
    },
    {
      img: 'assets/images/pizza3.png',
      title: 'Бекон и Сосиски',
      ingridietns: 'Бекон, сыр, сосиски, ананас, томатная паста'
    },
    {
      img: 'assets/images/pizza4.png',
      title: 'Куриная Делюкс',
      ingridietns: 'Курица, ананас, сыр Пепперони, соус для пиццы, томатная паста'
    },
    {
      img: 'assets/images/pizza5.png',
      title: 'Барбекю Премиум',
      ingridietns: 'Свинина BBQ, соус Барбкею, сыр, курица, соус для пиццы, соус чили'
    },
    {
      img: 'assets/images/pizza6.png',
      title: 'Пепперони Дабл',
      ingridietns: 'Пепперони, сыр, колбаса 2 видов: обжаренная и вареная'
    },
    {
      img: 'assets/images/pizza7.png',
      title: 'Куриное трио',
      ingridietns: 'Жареная курица, Тушеная курица, Куриные наггетсы, перец, сыр, грибы, соус для пиццы'
    },
    {
      img: 'assets/images/pizza8.png',
      title: 'Сырная',
      ingridietns: 'Сыр Джюгас, Сыр с плесенью, Сыр Моцарелла, Сыр секретный'
    },
  ];

  orderForm: FormGroup;
  
  errorMessages = {
    name: {
      required: 'Имя обязательно для заполнения',
      minlength: 'Имя должно содержать минимум 2 символа',
      maxlength: 'Имя не должно превышать 50 символов'
    },
    address: {
      required: 'Адрес обязателен для заполнения',
      minlength: 'Адрес должен содержать минимум 10 символов'
    },
    phone: {
      required: 'Телефон обязателен для заполнения',
      pattern: 'Введите корректный номер телефона'
    }
  };

  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({});
    
    document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange.bind(this));
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange.bind(this));
  }

  ngOnInit(): void {
    this.initForm();
  }

  async openFullscreen(pizza: any): Promise<void> {
    this.selectedPizza = pizza;
    
    const element = this.fullscreenContainer.nativeElement;
    
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      
      this.isFullscreenMode = true;
    } catch (err) {
      console.error('Ошибка при включении полноэкранного режима:', err);
      this.isFullscreenMode = true;
      document.body.style.overflow = 'hidden';
    }
  }

  // Метод для выхода из полноэкранного режима
  closeFullscreen(): void {
    if (document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).mozFullScreenElement || 
        (document as any).msFullscreenElement) {
      
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
    
    this.isFullscreenMode = false;
    this.selectedPizza = null;
    document.body.style.overflow = 'auto';
  }

  // Обработчик изменения состояния полноэкранного режима
  private handleFullscreenChange(): void {
    const isFullscreen = !!(document.fullscreenElement || 
                           (document as any).webkitFullscreenElement || 
                           (document as any).mozFullScreenElement || 
                           (document as any).msFullscreenElement);
    
    if (!isFullscreen) {
      this.isFullscreenMode = false;
      this.selectedPizza = null;
      document.body.style.overflow = 'auto';
    }
  }

  // Закрытие по клавише ESC
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    if (this.isFullscreenMode) {
      this.closeFullscreen();
    }
  }

  initForm(): void {
    this.orderForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      
      address: ['', [
        Validators.required,
        Validators.minLength(10)
      ]],
      
      phone: ['', [
        Validators.required,
        Validators.pattern(/^(\+7|7|8)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/)
      ]]
    });
  }

  get nameControl(): FormControl {
    return this.orderForm.get('name') as FormControl;
  }

  get addressControl(): FormControl {
    return this.orderForm.get('address') as FormControl;
  }

  get phoneControl(): FormControl {
    return this.orderForm.get('phone') as FormControl;
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.markFormGroupTouched(this.orderForm);
      return;
    }
    
    this.fakeApiRequest().subscribe({
      next: (response) => {
        alert('✅ Спасибо за заказ');
        console.log('Запрос выполнен:', response);
      },
      error: (error) => {
        console.error('Ошибка запроса:', error);
      }
    });
  }

  private fakeApiRequest(): Observable<string> {
    return of('Спасибо за заказ! Ваша пицца готовится.').pipe(
      delay(2000),
      tap(() => {
        console.log('Заказ успешно обработан:', this.orderForm.value);
      })
    );
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}