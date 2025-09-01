import type { Contact, Group } from '../../../types';
import Storage from "../../../utils/Storage";
import ArrowIcon from "../../../assets/dropdown-arrow.svg";
import IMask from 'imask';
import { Toaster } from '../Toaster/Toaster';

const storage = Storage.getInstance();
const toaster = Toaster.getInstance();

function renderContactItem(contact: Contact): string {
  return `
    <div class="contact-item" data-contact-id="${contact.id}">
      <span class="contact-item__name">${contact.name}</span>
      <div class="contact-item__wrapper">
      <span class="contact-item__phone">${contact.phone}</span>
      <div class="contact-item__actions">
        <button class="contact-item__edit" data-contact-id="${contact.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <g clip-path="url(#clip0_128484_213)">
                <path opacity="0.3" d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="black"/>
            </g>
            <defs>
                <clipPath id="clip0_128484_213">
                <rect width="24" height="24" fill="white"/>
                </clipPath>
            </defs>
        </svg>
        </button>
        <button class="contact-item__delete" data-contact-id="${contact.id}">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path opacity="0.3" d="M1.66688 17.3889C1.66688 18.55 2.61688 19.5 3.77799 19.5H12.2224C13.3836 19.5 14.3336 18.55 14.3336 17.3889V4.72222H1.66688V17.3889ZM4.26355 9.87333L5.75188 8.385L8.00022 10.6228L10.238 8.385L11.7263 9.87333L9.48855 12.1111L11.7263 14.3489L10.238 15.8372L8.00022 13.5994L5.76244 15.8372L4.27411 14.3489L6.51188 12.1111L4.26355 9.87333ZM11.6947 1.55556L10.6391 0.5H5.36133L4.30577 1.55556H0.611328V3.66667H15.3891V1.55556H11.6947Z" fill="black"/>
        </svg>
        </button>
      </div>
      </div>
    </div>
  `;
}

function renderGroupItem(group: Group, contacts: Contact[]): string {
  const groupContacts = contacts
    .filter(contact => contact.group === group.id)
    .map(renderContactItem)
    .join('');

  return `
    <div class="group-block" data-group-id="${group.id}">
      <div class="group-block__header">
        <span class="group-block__name">${group.name}</span>
        <button class="group-block__toggle"><img src="${ArrowIcon}" alt="Arrow icon"/></button>
      </div>
      <div class="group-block__contacts">
        ${groupContacts}
      </div>
    </div>
  `;
}

export function renderContactsList(): string {
  const groups = storage.getGroups();
  const contacts = storage.getContacts();

  if (groups.length === 0) {
    return `
      <div class="contacts-list empty">
        <p>Список контактов пуст</p>
      </div>
    `;
  }

  return `
    <div class="contacts-list">
      ${groups.map(group => renderGroupItem(group, contacts)).join('')}
    </div>
  `;
}


export function initContactsList() {
  const container = document.querySelector('.contacts-list') as HTMLElement;

  container?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    const editBtn = target.closest('.contact-item__edit');
    if (editBtn) {
      const contactId = (editBtn as HTMLElement).dataset.contactId!;
      const contactEl = container.querySelector(
        `.contact-item[data-contact-id="${contactId}"]`
      ) as HTMLElement;

      if (!contactEl) return;

      const nameEl = contactEl.querySelector('.contact-item__name') as HTMLElement;
      const phoneEl = contactEl.querySelector('.contact-item__phone') as HTMLElement;

      const currentName = nameEl.textContent || '';
      const currentPhone = phoneEl.textContent || '';

      nameEl.innerHTML = `<input type="text" class="contact-edit__name" value="${currentName}"/>`;
      phoneEl.innerHTML = `<input type="text" class="contact-edit__phone" value="${currentPhone}"/>`;

      const phoneInput = phoneEl.querySelector('.contact-edit__phone') as HTMLInputElement;

      IMask(phoneInput, {
        mask: '+{7}(000)000-00-00'
      });
    
      editBtn.outerHTML = `<button class="contact-item__save btn--blue" data-contact-id="${contactId}">Сохранить</button>`;
  
    }

    const saveBtn = target.closest('.contact-item__save');
    if (saveBtn && saveBtn instanceof HTMLElement) {
      const contactId = saveBtn.dataset.contactId!;
      const contactEl = container.querySelector(`.contact-item[data-contact-id="${contactId}"]`) as HTMLElement;
      if (!contactEl) return;
    
      const nameInput = contactEl.querySelector('.contact-edit__name') as HTMLInputElement;
      const phoneInput = contactEl.querySelector('.contact-edit__phone') as HTMLInputElement;

      const updatedName = nameInput.value.trim();
      const updatedPhone = phoneInput.value.trim();
    
      const contacts = storage.getContacts();
      storage.saveContacts(
        contacts.map(c => c.id === contactId ? { ...c, name: updatedName, phone: updatedPhone } : c)
      );
    
      contactEl.querySelector('.contact-item__name')!.textContent = updatedName;
      contactEl.querySelector('.contact-item__phone')!.textContent = updatedPhone;

      const actionsEl = contactEl.querySelector('.contact-item__actions')!;
      actionsEl.querySelector('.contact-item__save')!.outerHTML = `
        <button class="contact-item__edit" data-contact-id="${contactId}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <g clip-path="url(#clip0_128484_213)">
                <path opacity="0.3" d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="black"/>
            </g>
            <defs>
                <clipPath id="clip0_128484_213">
                <rect width="24" height="24" fill="white"/>
                </clipPath>
            </defs>
        </svg></button>
      `;
    
      toaster.success('Контакт успешно изменен');
      return;
    }
    
    
    const deleteBtn = target.closest('.contact-item__delete');
    if (deleteBtn ) {
      const contactId = (deleteBtn as HTMLElement).dataset.contactId!;
      storage.deleteContact(contactId);

      const contactEl = container.querySelector(`.contact-item[data-contact-id="${contactId}"]`);
      contactEl?.remove();

      toaster.success('Контакт успешно удален');
      return;
    }
    
    const toggle = target.closest('.group-block__toggle');
    const header = target.closest('.group-block__header');

    if (toggle || header) {
      const groupBlock = target.closest('.group-block') as HTMLElement;
      groupBlock.classList.toggle('open');
    }
  });
}

