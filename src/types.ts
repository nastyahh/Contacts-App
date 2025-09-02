export interface Contact {
  id: string;
  name: string;
  phone: string;
  group?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
}

export type ToastType = "success" | "error" | "warning";

export interface ToastOptions {
  type: ToastType;
  message: string;
  duration?: number;
}

export interface PopupOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}