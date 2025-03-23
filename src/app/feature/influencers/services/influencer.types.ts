export interface Influencer {
  id: number | undefined;
  firstName: string;
  lastName: string;
  instagramId: string;
  apiKey: string;
  email: string;
  city: string;
  followersAmount: string;
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
  firstName: string;
  lastName: string;
  accountStatus: string;
  influencer: Influencer;
  createdTime: string;
  lastUpdateTime: string;
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
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
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

export interface City {
  id: number;
  name: string;
}

// export interface TypeAccount

// export interface MessageToInfluenser {
//     // id: number | undefined;
//     messageToInfluenser: string;
// }

// id: number | undefined | null;
// instagramNick: string;
// firstName: string;
// lastName: string;
// email: string;
// city: string;
// messageToAdmin: string;
// noteFromAdmin: string;
// accountStatus: AccountStatus;
