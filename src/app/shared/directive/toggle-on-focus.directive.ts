import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[toggleOnFocus]',
  standalone: true
})
export class ToggleOnFocusDirective {
  @Input('toggleOnFocus') 
  targetElementSelector!: string;

  private targetElement: HTMLElement | null = null;
  private hostElement: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.hostElement = this.el.nativeElement;
    this.renderer.setStyle(this.hostElement, 'display', 'none');
  }

  ngAfterViewInit() {
    if (this.targetElementSelector) {
      this.targetElement = document.querySelector(this.targetElementSelector);
      if (this.targetElement) {
        this.renderer.listen(this.targetElement, 'focus', () => this.showHostElement());
        this.renderer.listen(this.targetElement, 'blur', () => this.handleBlur());
      }
    }
  }

  @HostListener('focusin') onHostFocusIn() {
    this.showHostElement();
  }

  @HostListener('focusout') onHostFocusOut() {
    this.handleBlur();
  }

  private showHostElement(): void {
    this.renderer.setStyle(this.hostElement, 'display', 'flex');
  }

  private hideHostElement(): void {
    this.renderer.setStyle(this.hostElement, 'display', 'none');
  }

  private handleBlur(): void {
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (!this.targetElement?.contains(activeElement) && !this.hostElement.contains(activeElement)) {
        this.hideHostElement();
      }
    }, 50);
  }
}
