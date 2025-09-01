import IMask from "imask";
import CrossIcon from '../../../assets/cross-icon.svg';
import Storage from '../../../utils/Storage';
import ArrowIcon from '../../../assets/dropdown-arrow.svg';
import type { Contact, Group } from "../../../types";
import  { Dropdown } from "../Dropdown/Dropdown";

export function renderContactSidebar(): string {
  return `
    <div class="sidebar contact-sidebar" id="contactSidebar">
      <div class="sidebar__overlay" id="contactSidebarOverlay"></div>
      <div class="sidebar__content">
        <div class="sidebar__header">
          <h2>Добавление контакта</h2>
          <button class="sidebar__close" id="closeContactSidebar">
           <img src="${CrossIcon}" alt="Cross icon"/>
          </button>
        </div>

       <form class="contact-form" id="contactForm" novalidate>
          <div class="form-group">
            <input type="text" id="name" name="name" required placeholder="Введите ФИО">
          </div>
          <div class="form-group">
            <input type="tel" id="phone" name="phone" required placeholder="Введите номер">
          </div>
          <div class="form-group dropdown-container" id="groupDropdown">
            <input type="text" id="group" name="group" placeholder="Выберите группу" readonly>
            <img src="${ArrowIcon}" alt="Arrow icon" class="dropdown-arrow"/>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn--blue">Сохранить</button>
          </div>
      </form>
      </div>
    </div>
  `;
}

const storage = Storage.getInstance();
let groups: Group[] = storage.getGroups();

export function initContactSidebar() {
  const sidebar = document.getElementById('contactSidebar') as HTMLElement;
  const sidebarOverlay = document.getElementById('contactSidebarOverlay') as HTMLElement;
  const closeSidebar = document.getElementById('closeContactSidebar') as HTMLElement;
  const contactForm = document.getElementById('contactForm') as HTMLFormElement;
  const groupDropdown = document.getElementById('groupDropdown') as HTMLElement;

  let dropdown: Dropdown | undefined;
  if (groupDropdown) {
    dropdown = new Dropdown(groupDropdown);
    dropdown.bind('change', (item) => {
      console.log('Выбрана группа:', item);
    });
  }

  function openSidebar() {
    sidebar.classList.add('open');
    document.body.style.overflow = 'hidden';

    groups = storage.getGroups();
    dropdown?.setDataItems(groups);
  }

  function closeSidebarFunc() {
    sidebar.classList.remove('open');
    document.body.style.overflow = '';
    contactForm.reset();
  }

  const headerAddContactBtn = document.querySelector('.header__addContact') as HTMLElement;
  headerAddContactBtn?.addEventListener('click', openSidebar);

  const mainAddContactBtn = document.querySelector('.addContact') as HTMLElement;
  mainAddContactBtn?.addEventListener('click', openSidebar);

  closeSidebar?.addEventListener('click', closeSidebarFunc);
  sidebarOverlay?.addEventListener('click', closeSidebarFunc);

  if (contactForm) {
    const requiredInputs = contactForm.querySelectorAll<HTMLInputElement>("input#name, input#phone");

    const clearErrors = () => {
      contactForm.querySelectorAll(".error-message").forEach(msg => msg.remove());
      requiredInputs.forEach(input => input.classList.remove("error"));
    };

    requiredInputs.forEach(input => {
      input.addEventListener("input", () => {
        if (input.value.trim()) {
          input.classList.remove("error");
          const errorMsg = input.parentElement?.querySelector(".error-message");
          if (errorMsg) errorMsg.remove();
        }
      });
    });

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();
    
      let isValid = true;
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add("error");
    
          const errorMsg = document.createElement("div");
          errorMsg.className = "error-message";
          errorMsg.textContent = "Поле является обязательным";
          input.insertAdjacentElement("afterend", errorMsg);
        }
      });
    
      if (!isValid) return;
    
      const name = (document.getElementById('name') as HTMLInputElement).value.trim();
      const phone = (document.getElementById('phone') as HTMLInputElement).value.trim();
      const groupName = (document.getElementById('group') as HTMLInputElement).value.trim();
    
      if (storage.findContactByPhone(phone)) {
        alert("Контакт с таким номером уже существует"); 
        return;
      }
    
      const group = groups.find(g => g.name === groupName);
    
      const newContact: Contact = {
        id: crypto.randomUUID(),
        name,
        phone,
        group: group?.id,
      };
    
      storage.addContact(newContact);
    
      contactForm.reset();
      closeSidebarFunc();
  
      console.log("Контакт создан:", newContact);
    });
    
  }

  const phoneInput = document.getElementById('phone') as HTMLInputElement;
  if (phoneInput) {
    IMask(phoneInput, {
      mask: '+{7}(000)000-00-00'
    });
  }
}
