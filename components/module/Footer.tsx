import { useEventContext } from "../../context/EventContext";
import { Event } from "../../types/api/Event";
import ColoredLogo from "./ColoredLogo";
import Contacts from "./Contacts";
import styles from "./Footer.module.scss";

export default function Footer() {
  const event = useEventContext() as Event;

  return (
    <div className={styles.container}>
      <ColoredLogo logoImg={event.organization.img_url} color={event.primary_color} />
      <Contacts organization={event.organization} />
    </div>
  );
}
