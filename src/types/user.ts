export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  varificationToken?: string;
  varificationTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}
