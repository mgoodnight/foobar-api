export interface GetUsersFilters {
  id?: number;
  email?: string;
}

export interface UserFromApi {
  id: number;
  email: string;
  fullName: string;
  created: Date;
  lastModified: Date;
}

export interface UserToApi {
  email: string;
  password: string;
  fullName: string;
}

export interface UserUpdateToApi {
  email: string;
  fullName: string;
  password?: string;
}
