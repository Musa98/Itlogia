import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen = false;
  windowWidth = window.innerWidth;

  ngOnInit() {
    this.updateWindowWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateWindowWidth();
    
    // Закрываем меню при переходе на десктоп
    if (this.windowWidth > 768 && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  updateWindowWidth() {
    this.windowWidth = window.innerWidth;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Блокируем прокрутку при открытом меню
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  // Закрываем меню при нажатии ESC
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.isMenuOpen) {
      this.closeMenu();
    }
  }
}
