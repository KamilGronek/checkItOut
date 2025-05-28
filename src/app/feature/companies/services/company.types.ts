export interface CompanyResponse {
  content: Company[];
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface Company {
  id: number | undefined;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  accountStatus: string;
  addresses: Address[];
  phoneNumber: string;
  instagramId: string;
  apiKey: string;
  imageUrl: string;
  note: string;
  serviceType: ServiceType;
  lastUpdateTime: string;
  createdTime: string;
  updater: string;
  // instagramAccountType: string;
  // accountStatus: string;
  messageToAdmin: string;
  noteFromAdmin: string;
  adminNoteTime: string;

  cityDisplay?: string;
  addressDisplay?: string;
}

export interface Address {
  city: string;
  country: string;
  createdTime: string;
  id: number;
  lastUpdateTime: string;
  postalCode: string;
  primary: boolean;
  state: string;
  street: string;
  userId: number;
}

interface ServiceType {
  id: number;
  description: string;
  category: string;
  name: string;
}

export interface City {
  id: number;
  name: string;
}
