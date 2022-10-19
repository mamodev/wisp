import { PageLayout } from "../components/layout/PageLayout";
import { NextPageWithLayout } from "./_app";
import QRCode from "react-qr-code";
import styles from "./user.module.scss";
import { Event } from "../types/api/Event";
import useThemeColors from "../hooks/useThemeColors";
import EventMaps from "../components/module/EventMap";
import ColoredLogo from "../components/module/ColoredLogo";
import Button, { ButtonVariants } from "../components/base/Button";
import { useRouter } from "next/router";
import React from "react";
import { AuthContext, axiosJson, useAuth } from "../context/AuthContext";
import { Booking } from "../types/api/Booking";
import { Size } from "../types/components/Utils";
import AztecCode from "../components/module/AztecCode";

type BookingState = { data: Booking | null; isSuccess: boolean };
const defaultbookingState = { data: null, isSuccess: false };

const User: NextPageWithLayout = () => {
  const router = useRouter();

  const { auth } = useAuth() as AuthContext;
  const [{ data, isSuccess }, setBooking] = React.useState<BookingState>(defaultbookingState);

  useThemeColors({
    primary: data?.event.primary_color ? `#${data.event.primary_color}` : undefined,
    secondary: data?.event.secondary_color ? `#${data.event.secondary_color}` : undefined,
    primary_constrast_text: "black",
  });
  //as
  React.useEffect(() => {
    if (auth.accessToken) {
      axiosJson
        .get("user/booking", { headers: { Authorization: `Bearer ${auth.accessToken}` } })
        .then((response) => {
          const booking = response.data as Booking;

          setBooking({ data: booking, isSuccess: true });
        })
        .catch(console.log);
    }
  }, [auth]);

  console.log(data);
  return (
    <div className={styles.container}>
      {isSuccess && data && (
        <>
          <div className={styles.header}>
            <h1 className="title big upper primary">{data.event.name}</h1>
            <h3 className="subtitle secondary">
              {new Date(data.event.date).toLocaleString("it-IT", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h3>
          </div>

          <p className="content secondary">
            Grazie <span className="primary">{data.user.first_name}</span> per la tua prenotazione!
          </p>
          <div>
            <p className="content secondary " style={{ textAlign: "center" }}>
              Fai uno <span className="primary">screenshot</span> di questa pagina per avere il
              biglietto a portata di mano!
            </p>
          </div>

          <div className={styles.ticket_container}>
            <div className={styles.qr_container}>
              <AztecCode code={data.code} />
            </div>

            <Button onClick={() => router.push(`/wildest-party`)} size={Size.large}>
              Visualizza evento
            </Button>
          </div>
          <ColoredLogo
            color={`#${data.event.primary_color}`}
            logoImg="https://firebasestorage.googleapis.com/v0/b/chicalinda-535e5.appspot.com/o/Generale%2Flogo.png?alt=media&token=44590914-4ff6-4fb7-9528-06fea81c255c"
          />
        </>
      )}
    </div>
  );
};

User.getLayout = function getLayout(page: React.ReactElement) {
  return page;
};

export default User;
