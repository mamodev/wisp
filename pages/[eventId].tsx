import React from "react";
import { PageLayout } from "../components/layout/PageLayout";
import EventMaps from "../components/module/EventMap";
import Footer from "../components/module/Footer";
import { EventProvider } from "../context/EventContext";
import { Event as EventType } from "../types/api/Event";
import { NextPageWithLayout } from "./_app";
import styles from "./[eventId].module.scss";
import useThemeColors from "../hooks/useThemeColors";
import Image from "next/image";
import image from "../public/event.jpg";
import { axiosJson } from "../context/AuthContext";
import PrenotationButton from "../components/module/PrenotationButton";

type EventPageProps = {
  event: EventType;
};

const Event: NextPageWithLayout<EventPageProps> = ({
  event,
}: EventPageProps) => {
  useThemeColors({
    primary: event.primary_color,
    secondary: event.secondary_color,
  });

  const eventDate = new Date(event.date);

  return (
    <EventProvider event={event}>
      <div className={styles.page_container}>
        <div className={styles.image_container}>
          <Image
            placeholder="blur"
            layout="responsive"
            src={image}
            alt="main_image"
          />
        </div>
        <div className={styles.button_contaienr}>
          <PrenotationButton event={event} />
        </div>
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
            {event.description.split("<br/>").map((line, i) => (
              <p className="content secondary" key={i}>
                {line}
              </p>
            ))}
            <p></p>
            <p className="title primary">Dove?</p>
            <p className="content secondary">
              📍 {event.location.name} {event.location.address}
            </p>
          </div>
        </div>

        <EventMaps
          name={event.name}
          position={[event.location.latitude, event.location.longitude]}
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

export async function getStaticPaths() {
  return {
    paths: [{ params: { eventId: "wildest-party" } }],
    fallback: false,
  };
}

export const getStaticProps = async () => {
  const response = await axiosJson.get(
    "event/ad3c19e9-4a7d-49bd-8735-97e2f867c56e"
  );
  const eventData = response.data as EventType;
  eventData.primary_color = `#${eventData.primary_color}`;
  eventData.secondary_color = `#${eventData.secondary_color}`;
  eventData.organization.img_url =
    "https://firebasestorage.googleapis.com/v0/b/chicalinda-535e5.appspot.com/o/Generale%2Flogo.png?alt=media&token=44590914-4ff6-4fb7-9528-06fea81c255c";
  return {
    props: { event: eventData },
  };
};

export default Event;
