import type { Contact, Group } from "../types";

class Storage {
  private static instance: Storage;
  private contactsKey = 'contacts';
  private groupsKey = 'groups';

  private constructor() {}

  public static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }

  public getContacts(): Contact[] {
    try {
      const contacts = localStorage.getItem(this.contactsKey);
      return contacts ? JSON.parse(contacts) : [];
    } catch (error) {
      console.error('Ошибка при загрузке контактов:', error);
      return [];
    }
  }

  public saveContacts(contacts: Contact[]) {
    try {
      localStorage.setItem(this.contactsKey, JSON.stringify(contacts));
    } catch (error) {
      console.error('Ошибка при сохранении контактов:', error);
    }
  }

  public addContact(contact: Contact) {
    const contacts = this.getContacts();
    contacts.push(contact);
    this.saveContacts(contacts);
  }

  public updateContact(contact: Contact) {
    const contacts = this.getContacts();
    const index = contacts.findIndex(c => c.id === contact.id);
    if (index !== -1) {
      contacts[index] = contact;
      this.saveContacts(contacts);
    }
  }

  public deleteContact(contactId: string) {
    const contacts = this.getContacts();
    const filteredContacts = contacts.filter(c => c.id !== contactId);
    this.saveContacts(filteredContacts);
  }

  public findContactByPhone(phone: string): Contact | undefined {
    const contacts = this.getContacts();
    return contacts.find(c => c.phone === phone);
  }

  public getGroups(): Group[] {
    try {
      const groups = localStorage.getItem(this.groupsKey);
      return groups ? JSON.parse(groups) : [];
    } catch (error) {
      console.error('Ошибка при загрузке групп:', error);
      return [];
    }
  }

  public saveGroups(groups: Group[]) {
    try {
      localStorage.setItem(this.groupsKey, JSON.stringify(groups));
    } catch (error) {
      console.error('Ошибка при сохранении групп:', error);
    }
  }

  public addGroup(group: Group): void {
    const groups = this.getGroups();
    groups.push(group);
    this.saveGroups(groups);
  }

  public updateGroup(group: Group): void {
    const groups = this.getGroups();
    const index = groups.findIndex(g => g.id === group.id);
    if (index !== -1) {
      groups[index] = group;
      this.saveGroups(groups);
    }
  }

  public deleteGroup(groupId: string): void {
    const groups = this.getGroups();
    const filteredGroups = groups.filter(g => g.id !== groupId);
    this.saveGroups(filteredGroups);
  }

  public findGroupByName(name: string): Group | undefined {
    const groups = this.getGroups();
    return groups.find(g => g.name === name);
  }

  public deleteContactsByGroup(groupId: string): void {
    const contacts = this.getContacts();
    const filteredContacts = contacts.filter(c => c.group !== groupId);
    this.saveContacts(filteredContacts);
  }
}

export default Storage; 