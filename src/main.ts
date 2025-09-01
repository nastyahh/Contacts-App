import "./styles/main.scss";
import PlusIcon from "./assets/plus-icon.svg?url";
import { renderHeader } from "./components/ui/Header/Header.ts";
import { renderContactSidebar, initContactSidebar } from "./components/ui/Sidebar/ContactSidebar.ts";
import { renderGroupSidebar, initGroupSidebar } from "./components/ui/Sidebar/GroupSidebar.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
   ${renderHeader()}
   <main>
   <div class="container">
   <button class="addContact btn--red">Добавить контакт <img src="${PlusIcon}" alt="Plus icon"/></button>
   </div>
   </main>
   ${renderContactSidebar()}
   ${renderGroupSidebar()}
`;

initContactSidebar();
initGroupSidebar();
