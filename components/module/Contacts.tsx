import { EventOrganization } from "../../types/api/Organization";
import { EmailIcon } from "../base/icons/EmailIcon";
import { InstagramIcon } from "../base/icons/InstagramIcon";
import { PhoneIcon } from "../base/icons/PhoneIcon";
import styles from "./Contacts.module.scss";

export default function Contacts({ organization }: { organization: EventOrganization }) {
  return (
    <div className={styles.container}>
      <div className={styles.contact_box}>
        <PhoneIcon />
        <p className="text text--small secondary">+39 {organization.phone}</p>
      </div>
      <div className={styles.contact_box}>
        <EmailIcon />
        <p className="text text--small secondary">@{organization.instagram_link}</p>
      </div>
      <div className={styles.contact_box}>
        <InstagramIcon />
        <p className="text text--small secondary">{organization.email}</p>
      </div>
    </div>
  );
}
