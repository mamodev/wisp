import { ReferralLink } from "./ReferralLink";

export type EventOrganization = {
  name: string;
  img_url: string;
  instagram_profile: string;
  phone: string;
  email: string;
};

export type Organization = {
  id: string;
  name: string;
  img_url: string;
  instagram_profile: string;
  phone: string;
  email: string;
  id_creator: string;
  description: string;
  locations: Location[];
  referralLinks: ReferralLink[];
};
