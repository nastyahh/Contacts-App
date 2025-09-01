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