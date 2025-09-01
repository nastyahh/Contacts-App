import CheckIcon from "../../../assets/check-circle.svg"
import type { ToastOptions } from "../../../types";

export class Toaster {
  private static instance: Toaster;
  private container!: HTMLElement;
  private defaultDuration = 3500;

  private constructor() {
    this.ensureContainer();
  }

  public static getInstance(): Toaster {
    if (!Toaster.instance) Toaster.instance = new Toaster();
    return Toaster.instance;
  }

  public success(message: string, opts: Partial<ToastOptions> = {}) {
    this.show({ type: 'success', message, ...opts });
  }
  public error(message: string, opts: Partial<ToastOptions> = {}) {
    this.show({ type: 'error', message, ...opts });
  }
  public warning(message: string, opts: Partial<ToastOptions> = {}) {
    this.show({ type: 'warning', message, ...opts });
  }

  public show(opts: ToastOptions) {
    const duration =
      typeof opts.duration === 'number' ? opts.duration : this.defaultDuration;
  
    const el = document.createElement('div');
    el.className = `toast toast--${opts.type}`;
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
  
    const iconHtml = opts.type === 'success' 
      ? `<div class="toast__icon" aria-hidden="true"><img src="${CheckIcon}" alt="Success icon"/></div>`
      : '';
  
    el.innerHTML = `
      ${iconHtml}
      <div class="toast__content">${opts.message}</div>
    `;
  
    const close = () => {
      el.classList.add('toast--leaving');
      el.addEventListener('animationend', () => {
        el.remove();
      }, { once: true });
    };
  
    let timer: number;
    if (duration > 0) {
      timer = window.setTimeout(() => {
        close();
      }, duration);
      
      el.addEventListener('mouseenter', () => {
        clearTimeout(timer);
      });
      
      el.addEventListener('mouseleave', () => {
        timer = window.setTimeout(() => {
          close();
        }, duration);
      });
    }
  
    this.container.appendChild(el);
  
    requestAnimationFrame(() => {
      el.classList.add('toast--enter');
    });
  
    return close;
  }

  private ensureContainer() {
    let c = document.querySelector<HTMLElement>('.toaster');
    if (!c) {
      c = document.createElement('div');
      c.className = 'toaster';
      document.body.appendChild(c);
    }
    this.container = c;
  }
}
