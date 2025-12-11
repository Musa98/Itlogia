import { Component, Input } from '@angular/core';
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-pizza-card',
  imports: [ButtonComponent],
  templateUrl: './pizza-card.component.html',
  styleUrl: './pizza-card.component.css'
})
export class PizzaCardComponent {
  @Input() img: string = 'assets/images/pizza1.png';
  @Input() title: string = 'Титул';
  @Input() ingridients: string = 'Тесто';
}
