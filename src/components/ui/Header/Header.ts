import BookIcon from "../../../assets/contact-book-icon.svg?url";

export function renderHeader() {
  return `
    <header class="header">
    <div class="header__left">
      <img src="${BookIcon}"/>
        <span>Книга контактов</span>
          </div>
          <div class="header__right">
        <button class="header__addContact btn--red">Добавить контакт</button>
        <button class="header__groupsBtn btn--blue">Группы</button>
    </div>
    </header>
     `;
}
