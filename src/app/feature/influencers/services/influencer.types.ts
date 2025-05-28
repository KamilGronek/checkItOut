export interface Influencer {
  id: number;
  firstName: string;
  lastName: string;
  instagramId: string;
  apiKey: string;
  email: string;
  city: string;
  followersAmount: number;
  instagramAccountType: string;
  accountStatus: string;
  messageToAdmin: string;
  noteFromAdmin: string;
  adminNoteTime: string;
}

export interface InfluencerUser {
  id: number;
  firebaseUserId: string;
  userType: string;
  email: string;
  addresses: Address;
  firstName: string;
  lastName: string;
  accountStatus: string;
  influencer: Influencer;
  createdTime: string;
  lastUpdateTime: string;
}

export interface Address {
  additionalInfo: string;
  addressType: string;
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

export interface InfluencerResponse {
  content: Influencer[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface InfluencerUserResponse {
  content: InfluencerUser[];
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface CityResponse {
  content: City[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface CurrencyResponse {
  content: Currency[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface Currency {
  id: number;
  name: string;
  isoCode: string;
  sign: string;
  countryCode: string;
}

export interface City {
  id: number;
  name: string;
}
