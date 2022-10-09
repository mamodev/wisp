import { User } from "./User";

export type ReferralLink = {
  id: string;
  name: string;
  users: User[];
};
