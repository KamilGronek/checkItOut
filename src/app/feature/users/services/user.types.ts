export enum UserType {
  ADMIN = 'ADMIN',
  INFLUENCER = 'INFLUENCER',
  COMPANY = 'COMPANY'
}

export enum AccountStatus {
  INACTIVE = 'INACTIVE',
  IN_VALIDATION = 'IN_VALIDATION',
  ACTIVE = 'ACTIVE',
  TO_BE_DELETED = 'TO_BE_DELETED',
  DELETED = 'DELETED'
}

export interface User {
  id?: number;
  firebaseUserId?: string;
  userType: UserType;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  profilePicture?: string;
  phoneNumber?: string;
  noteFromAdmin?: string;
  accountStatus: AccountStatus;
  createdTime?: string;
  lastUpdateTime?: string;
}

export interface CreateUserRequest {
  userType: UserType;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  profilePicture?: string;
  phoneNumber?: string;
  noteFromAdmin?: string;
  accountStatus: AccountStatus;
}

export interface UpdateUserRequest {
  userType?: UserType;
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  profilePicture?: string;
  phoneNumber?: string;
  noteFromAdmin?: string;
  accountStatus?: AccountStatus;
}

export interface UserResponse {
  content: User[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface UserSearchParams {
  page?: number;
  size?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  accountStatus?: AccountStatus;
  userType?: UserType;
  followersAmount?: string;
  sort?: string;
}
