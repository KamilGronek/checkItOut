export interface Card {
  id: string | null;
  boardId: string;
  listId: string;
  position: number;
  title: string;
  description: string | null;
  dueDate: string | null;
}

export interface CollaborationResponse {
  content: Collaboration[];
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface Collaboration {
  id: number | undefined;
  name: string;
  city: string;
  title: string;
  details: string;
  requirements: string;
  compensationType: string;
  compensationAmountMin: number;
  compensationAmountMax: number;
  compensationDescription: null;
  platforms: Platforms[];
  contentTypes: number[];
  company: CompanyCollaboration | number;
  serviceType: ServiceTypeCollaboration | number;
  startDate: string;
  endDate: string;
  photos: PhotoList[];
  createdTime: string;
  lastUpdateTime: string;
  updater: string;
  imageUrl: string;
}

export interface Platforms {
  id: number | undefined;
  name: string;
  logoUrl: string;
  contentTypes: ContentTypes;
  active: boolean;
}

export interface ContentTypes {
  id: number | undefined;
  name: string;
}

export interface ContentTypeResponse {
  content: ContentTypes[];
  page: PageInfo;
}

export interface PhotoList {
  url: string;
  orderNumber: number;
  isCover: boolean;
}

export interface CompanyCollaboration {
  id: number | undefined;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  address: string;
  imageUrl: string;
  note: string;
  serviceType: {
    id: number;
    name: string;
    description: string;
    category: string;
  };
  accountStatus: null;
  lastUpdateTime: string;
  createdTime: string;
  updater: string;
}

export interface User {
  content: UserContent[];
  page: PageInfo;
}

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface ServiceTypeCollaboration {
  content: ServiceType[];
  paged: PageInfo;
}

export interface ServiceType {
  id: number;
  name: string;
  description: string;
  category: string;
}

export interface UserContent {
  id: number;
  firebaseUserId: string;
  profilePicture: string;
  userType: string;
  userTypePL: string;
  email: string;
  firstName: string;
  lastName: string;
  accountStatusPL: string;
  accountStatus: string;
  influencer?: Influencer;
  company?: Company;
  createdTime: string;
  lastUpdateTime: string;
}

export interface Influencer {
  instagramId: string;
  city: string;
  apiKey: string;
  noteFromAdmin: string | null;
  followersAmount: number;
  instagramAccountType: string;
  lastUpdateTime: string;
  createdTime: string;
  updater: string | null;
}

export interface Company {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  address: string;
  imageUrl: string;
  note: string;
  serviceType: ServiceType;
  accountStatus: string | null;
  lastUpdateTime: string;
  createdTime: string;
  updater: string;
}
