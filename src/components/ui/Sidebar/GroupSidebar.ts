import Storage from '../../../utils/Storage';
import CrossIcon from '../../../assets/cross-icon.svg';
import type { Group } from '../../../types';

const storage = Storage.getInstance();

const deleteIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
  <g clip-path="url(#clip0)">
    <path opacity="0.3" d="M6.66664 20.3889C6.66664 21.55 7.61664 22.5 8.77775 22.5H17.2222C18.3833 22.5 19.3333 21.55 19.3333 20.3889V7.72222H6.66664V20.3889ZM9.26331 12.8733L10.7516 11.385L13 13.6228L15.2378 11.385L16.7261 12.8733L14.4883 15.1111L16.7261 17.3489L15.2378 18.8372L13 16.5994L10.7622 18.8372L9.27386 17.3489L11.5116 15.1111L9.26331 12.8733ZM16.6944 4.55556L15.6389 3.5H10.3611L9.30553 4.55556H5.61108V6.66667H20.3889V4.55556H16.6944Z" fill="black"/>
  </g>
  <defs>
    <clipPath id="clip0">
      <rect width="25.3333" height="25.3333" fill="white"/>
    </clipPath>
  </defs>
</svg>
`;

function renderGroupItem(group: Group): string {
  return `
    <div class="group-item" data-group-id="${group.id}">
      <div class="group-item__name">${group.name}</div>
      <button class="group-item__delete" data-group-id="${group.id}">
        ${deleteIcon}
      </button>
    </div>
  `;
}

export function renderGroupSidebar(): string {
  const groups = storage.getGroups();
  return `
    <div class="sidebar group-sidebar" id="groupSidebar">
      <div class="sidebar__overlay" id="groupSidebarOverlay"></div>
      <div class="sidebar__content">
        <div class="sidebar__header">
          <h2>Группы контактов</h2>
          <button class="sidebar__close" id="closeGroupSidebar">
            <img src="${CrossIcon}" alt="Close"/>
          </button>
        </div>
        <div class="groups-content">
          <div class="groups-list" id="groupsList">
            ${groups.map(renderGroupItem).join('')}
          </div>
          
          <div class="add-group-section" id="addGroupSection" style="display:none;">
            <div class="form-group group-item">
              <input type="text" id="newGroupName" placeholder="Введите название" class="group-item__name" required>
              <button type="button" class="group-item__delete" id="cancelAddGroup">${deleteIcon}</button>
            </div>
          </div>
          
          <div class="groups-actions">
            <button type="button" class="btn--text" id="addGroupBtn">Добавить</button>
            <button type="button" class="btn--blue" id="saveGroupBtn">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initGroupSidebar(): void {
  let groups = storage.getGroups();

  const sidebar = document.getElementById('groupSidebar') as HTMLElement;
  const sidebarOverlay = document.getElementById('groupSidebarOverlay') as HTMLElement;
  const closeSidebarBtn = document.getElementById('closeGroupSidebar') as HTMLElement;
  const groupsList = document.getElementById('groupsList') as HTMLElement;
  const addGroupBtn = document.getElementById('addGroupBtn') as HTMLElement;
  const saveGroupBtn = document.getElementById('saveGroupBtn') as HTMLElement;
  const addGroupSection = document.getElementById('addGroupSection') as HTMLElement;
  const newGroupNameInput = document.getElementById('newGroupName') as HTMLInputElement;
  const cancelAddGroupBtn = document.getElementById('cancelAddGroup') as HTMLElement;
  const headerGroupsBtn = document.querySelector('.header__groupsBtn') as HTMLElement;

  const openSidebar = () => {
    sidebar?.classList.add('open');
    document.body.style.overflow = 'hidden';
    groups = storage.getGroups();
    updateGroupsList();
  };

  const closeSidebarFunc = () => {
    sidebar?.classList.remove('open');
    document.body.style.overflow = '';
    resetAddGroupForm();
  };

  const updateGroupsList = () => {
    if (groupsList) {
      groupsList.innerHTML = groups.map(renderGroupItem).join('');
    }
  };

  const resetAddGroupForm = () => {
    addGroupSection!.style.display = 'none';
    addGroupBtn!.style.display = 'block';
    newGroupNameInput!.value = '';
  };

  const showAddGroupForm = () => {
    addGroupSection!.style.display = 'block';
    addGroupBtn!.style.display = 'none';
    newGroupNameInput!.focus();
  };

  const clearErrors = () => {
    const errorMsg = newGroupNameInput?.parentElement?.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
    newGroupNameInput?.classList.remove('error');
  };
  
  const showError = (message: string) => {
    clearErrors();
    if (!newGroupNameInput) return;
  
    newGroupNameInput.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    newGroupNameInput.parentElement?.appendChild(errorDiv);
  };

  const saveGroup = () => {
    clearErrors();
    const groupName = newGroupNameInput?.value.trim();
  
    if (!groupName) {
      showError('Введите название группы');
      return;
    }
  
    if (storage.findGroupByName(groupName)) {
      showError('Группа с таким названием уже существует');
      return;
    }
  
    const groupData: Group = { id: Date.now().toString(), name: groupName };
    storage.addGroup(groupData);
    groups = storage.getGroups();
    updateGroupsList();
    resetAddGroupForm();
  };


  const deleteGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    const confirmed = confirm(`Вы уверены, что хотите удалить группу "${group.name}"? Это приведет к удалению всех контактов, находящихся в этой группе.`);
    if (!confirmed) return;

    storage.deleteContactsByGroup(groupId);
    storage.deleteGroup(groupId);
    groups = storage.getGroups();
    updateGroupsList();
    alert('Группа и все контакты были успешно удалены');
  };

  headerGroupsBtn?.addEventListener('click', openSidebar);
  closeSidebarBtn?.addEventListener('click', closeSidebarFunc);
  sidebarOverlay?.addEventListener('click', closeSidebarFunc);
  addGroupBtn?.addEventListener('click', showAddGroupForm);
  cancelAddGroupBtn?.addEventListener('click', resetAddGroupForm);
  saveGroupBtn?.addEventListener('click', saveGroup);

  groupsList?.addEventListener('click', e => {
    const target = (e.target as HTMLElement).closest('.group-item__delete');
    const groupId = target?.getAttribute('data-group-id');
    if (groupId) deleteGroup(groupId);
  });
}
