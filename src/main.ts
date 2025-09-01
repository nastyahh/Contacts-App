import "./styles/main.scss";
import PlusIcon from "./assets/plus-icon.svg?url";
import { renderHeader } from "./components/ui/Header/Header.ts";
import {
  renderContactSidebar,
  initContactSidebar,
} from "./components/ui/Sidebar/ContactSidebar.ts";
import {
  renderGroupSidebar,
  initGroupSidebar,
} from "./components/ui/Sidebar/GroupSidebar.ts";
import { initContactsList, renderContactsList } from "./components/ui/ContactsList/ContactsList.ts";


document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
   ${renderHeader()}
   <main>
   <div class="container">
   <button class="addContact btn--red">Добавить контакт <img src="${PlusIcon}" alt="Plus icon"/></button>
   ${renderContactsList()}
   </div>
   </main>
   ${renderContactSidebar()}
   ${renderGroupSidebar()}
`;

initContactSidebar();
initGroupSidebar();
initContactsList();
