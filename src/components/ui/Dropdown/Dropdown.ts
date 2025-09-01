import type { Group } from "../../../types";

type DropdownEvent = 'change' | 'open' | 'close';
type EventCallback = (data?: Group) => void;

export class Dropdown {
  private element: HTMLElement;
  private input: HTMLInputElement;
  private isOpen: boolean = false;
  private items: Group[] = [];
  private listeners: Record<DropdownEvent, EventCallback[]> = { change: [], open: [], close: [] };

  constructor(element: HTMLElement) {
    this.element = element;
    this.input = element.querySelector('input') as HTMLInputElement;
    this.init();
  }

  private init() {
    this.element.addEventListener('click', () => this.toggle());
    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target as Node)) this.close();
    });
  }

  public bind(event: DropdownEvent, callback: EventCallback) {
    this.listeners[event].push(callback);
  }

  public setDataItems(items: Group[]) {
    this.items = items;
    this.renderItems();
  }

  private emit(event: DropdownEvent, data?: Group) {
    this.listeners[event].forEach(cb => cb(data));
  }

  private toggle() {
    this.isOpen ? this.close() : this.open();
  }

  private open() {
    this.isOpen = true;
    this.element.classList.add('dropdown--open');
    this.emit('open');
  }

  private close() {
    this.isOpen = false;
    this.element.classList.remove('dropdown--open');
    this.emit('close');
  }

  private renderItems() {
    this.element.querySelectorAll('.dropdown-item').forEach(item => item.remove());

    let itemsContainer = this.element.querySelector('.dropdown-items') as HTMLElement | null;
    if (!itemsContainer) {
      itemsContainer = document.createElement('div');
      itemsContainer.className = 'dropdown-items';
      this.element.appendChild(itemsContainer);
    }

    this.items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'dropdown-item';
      itemElement.textContent = item.name;
      itemElement.addEventListener('click', () => {
        this.input.value = item.name;
        this.emit('change', item);
        this.close();
      });
      itemsContainer!.appendChild(itemElement);
    });
  }
}
