import { Directive, ElementRef, Input, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[toggleOnFocus]',
  standalone: true
})
export class ToggleOnFocusDirective implements AfterViewInit, OnDestroy {
  @Input('toggleOnFocus')
  targetElementSelector!: string;

  private targetElement: HTMLElement | null = null;
  private hostElement: HTMLElement;

  private removeTargetFocusListener: (() => void) | null = null;
  private removeTargetBlurListener: (() => void) | null = null;
  private removeHostFocusInListener: (() => void) | null = null;
  private removeHostFocusOutListener: (() => void) | null = null;
  private removeDocumentClickListener: (() => void) | null = null;
  private hideTimeout: any = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.hostElement = this.el.nativeElement;
  
    this.renderer.addClass(this.hostElement, 'toggle-hidden');
  }

  ngAfterViewInit(): void {
    if (!this.targetElementSelector) {
      return;
    }

    this.targetElement = document.querySelector(this.targetElementSelector);

    if (!this.targetElement) {
      return;
    }

    this.removeTargetFocusListener = this.renderer.listen(this.targetElement, 'focus', this.showHostElement.bind(this));
    this.removeTargetBlurListener = this.renderer.listen(this.targetElement, 'blur', this.handleBlur.bind(this));

    this.removeHostFocusInListener = this.renderer.listen(this.hostElement, 'focusin', this.showHostElement.bind(this));
    this.removeHostFocusOutListener = this.renderer.listen(this.hostElement, 'focusout', this.handleBlur.bind(this));

    this.removeDocumentClickListener = this.renderer.listen('document', 'click', this.handleDocumentClick.bind(this));
  }

  private showHostElement(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    this.renderer.setStyle(this.hostElement, 'display', 'flex');
    this.renderer.removeClass(this.hostElement, 'toggle-hidden');
    this.renderer.addClass(this.hostElement, 'is-visible');
  }

  private hideHostElement(): void {
    // Спочатку ініціюємо анімацію зникнення (opacity: 0)
    this.renderer.removeClass(this.hostElement, 'is-visible');
    this.renderer.addClass(this.hostElement, 'toggle-hidden');

    setTimeout(() => {
      this.renderer.setStyle(this.hostElement, 'display', 'none');
    }, 300);
  }

  private handleBlur(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    this.hideTimeout = setTimeout(() => {
      const activeElement = document.activeElement;
      if (!this.targetElement?.contains(activeElement) && !this.hostElement.contains(activeElement)) {
        this.hideHostElement();
      }
      this.hideTimeout = null;
    }, 50);
  }

  private handleDocumentClick(event: Event): void {
    if (this.targetElement && !this.targetElement.contains(event.target as Node) &&
      !this.hostElement.contains(event.target as Node)) {
      this.hideHostElement();
    }
  }

  ngOnDestroy(): void {
    if (this.removeTargetFocusListener) this.removeTargetFocusListener();
    if (this.removeTargetBlurListener) this.removeTargetBlurListener();
    if (this.removeHostFocusInListener) this.removeHostFocusInListener();
    if (this.removeHostFocusOutListener) this.removeHostFocusOutListener();
    if (this.removeDocumentClickListener) this.removeDocumentClickListener();
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
  }
}