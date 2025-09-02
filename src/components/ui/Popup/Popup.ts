import type { PopupOptions } from "../../../types";

export class Popup {
  private static instance: Popup;
  private overlay: HTMLElement;
  private modal: HTMLElement;
  private options: PopupOptions | null = null;

  private constructor() {
    this.overlay = document.createElement("div");
    this.overlay.className = "popup-overlay";
    this.overlay.style.display = "none";

    this.modal = document.createElement("div");
    this.modal.className = "popup";
    this.overlay.appendChild(this.modal);

    document.body.appendChild(this.overlay);

    this.modal.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      if (target.closest(".popup__confirm")) {
        this.options?.onConfirm();
        this.hide();
      }

      if (target.closest(".popup__cancel") || target.closest(".popup__close")) {
        this.options?.onCancel?.();
        this.hide();
      }
    });

    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) {
        this.options?.onCancel?.();
        this.hide();
      }
    });
  }

  public static getInstance(): Popup {
    if (!Popup.instance) {
      Popup.instance = new Popup();
    }
    return Popup.instance;
  }

  public show(options: PopupOptions) {
    this.options = options;

    this.modal.innerHTML = `
      <button class="popup__close btn--close">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path opacity="0.3" d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="black"/>
        </svg>
      </button>
      <div class="popup__content">
        <h3 class="popup__title">${options.title}</h3>
        <p class="popup__message">${options.message}</p>
        <div class="popup__actions">
          <button class="popup__confirm btn--blue">
            ${options.confirmText || "Подтвердить"}
          </button>
          <button class="popup__cancel">
            ${options.cancelText || "Отменить"}
          </button>
        </div>
      </div>
    `;

    this.overlay.style.display = "flex";
    setTimeout(() => {
      this.overlay.classList.add("visible");
      this.modal.classList.add("visible");
    }, 10);
  }

  public hide() {
    this.overlay.classList.remove("visible");
    this.modal.classList.remove("visible");

    setTimeout(() => {
      this.overlay.style.display = "none";
    }, 300);
  }
}
