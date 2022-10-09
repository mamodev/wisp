import { useEffect, useRef } from "react";
import { PageLayout } from "../components/layout/PageLayout";
import EventMaps from "../components/module/EventMap";
import Footer from "../components/module/Footer";
import { EventProvider } from "../context/EventContext";
import { Event as EventType } from "../types/api/Event";
import { NextPageWithLayout } from "./_app";
import styles from "./[eventId].module.scss";
import Button from "../components/base/Button";
import { Size } from "../types/components/Utils";
import { composeClasses } from "../components/utils";

type EventPageProps = {
  event: EventType;
};

const Event: NextPageWithLayout<EventPageProps> = ({ event }: EventPageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = containerRef.current;
    if (!div) return;
    div.style.setProperty("--color-primary", event.primary_color);
    div.style.setProperty("--color-secondary", event.secondary_color);
  }, []);

  const eventDate = new Date(event.date);
  return (
    <EventProvider event={event}>
      <div ref={containerRef} className={styles.page_container}>
        <div className={styles.image_container}>
          <img
            src={event.img_url}
            alt="main_image"
            style={{ objectFit: "contain", width: "100%" }}
          />
        </div>
        <Button onClick={() => {}} size={Size.large}>
          Prenota
        </Button>
        <div className={styles.body}>
          <div className={styles.header}>
            <h1 className="title big upper primary">{event.name}</h1>
            <h3 className="subtitle secondary">
              {eventDate.toLocaleString("it-IT", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h3>
          </div>

          <div className={styles.description_container}>
            <p className="title primary">Descrizione</p>
            <p className="content secondary">{event.description}</p>
            <p className="title primary">Dove?</p>
            <p className="content secondary">
              📍 {event.location.name} {event.location.address}
            </p>
          </div>
        </div>

        <EventMaps
          name={event.name}
          position={event.location.coordinates}
          primary={event.primary_color}
          secondary={event.secondary_color}
        />
        <Footer />
      </div>
    </EventProvider>
  );
};

Event.getLayout = function getLayout(page: React.ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export async function getServerSideProps() {
  const event: EventType = {
    id: "",
    name: "Wildest Party",
    img_url:
      "https://firebasestorage.googleapis.com/v0/b/chicalinda-535e5.appspot.com/o/Eventi%2FCopertine%2F01_10_2022.jpg?alt=media&token=04d21c02-b8be-4cea-a786-de4e36b07509",
    description: "description of the event",

    date: "Wed, 05 Oct 2022 23:43:22 GMT",
    visible_date: "",
    open_date: "",
    close_date: "",

    organization: {
      email: "marco.morozzi2002@gmail.com",
      name: "neropaco",
      img_url:
        "https://firebasestorage.googleapis.com/v0/b/chicalinda-535e5.appspot.com/o/Generale%2Flogo.png?alt=media&token=44590914-4ff6-4fb7-9528-06fea81c255c",
      instagram_profile: "Neropaco",
      phone: "3888992820",
    },

    location: {
      name: "Sporing club",
      address: "via prova n 124",
      coordinates: [43.851349, 11.169581],
    },
    primary_color: "#d93737",
    secondary_color: "#ffebeb",
  };
  return {
    props: { event },
  };
}

export default Event;
