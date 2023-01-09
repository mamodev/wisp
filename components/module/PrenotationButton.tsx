import { useRouter } from "next/router";
import React from "react";
import { AuthContext, useAuth } from "../../context/AuthContext";
import { Event } from "../../types/api/Event";
import { Booking } from "../../types/api/Booking";
import { Size } from "../../types/components/Utils";
import Button, { ButtonProps, ButtonVariants } from "../base/Button";
import useAxiosAuth from "../../hooks/useAuthAxios";

type BookingState = {
  booking: boolean;
  isSuccess: boolean;
  isLoading: boolean;
};
const defaultbookingState = {
  booking: false,
  isSuccess: false,
  isLoading: false,
};

export default function PrenotationButton({ event }: { event: Event }) {
  const { auth, setAuth } = useAuth() as AuthContext;
  const axios = useAxiosAuth({});

  const router = useRouter();
  const referral = router.query.ref;

  const canBook =
    new Date(event.open_date).getTime() < new Date().getTime() &&
    new Date().getTime() < new Date(event.close_date).getTime();

  const [{ booking, isSuccess, isLoading }, setBooking] =
    React.useState<BookingState>(defaultbookingState);

  React.useEffect(() => {
    if (auth.accessToken) {
      setBooking((old) => ({ ...old, isLoading: true }));
      axios
        .get("user/booking", {
          headers: { Authorization: `Bearer ${auth.accessToken}` },
        })
        .then((response) => {
          if (!response.data || response.data === " ") {
            console.log("no booking");
            setBooking({ booking: false, isSuccess: true, isLoading: false });
          } else response.data;
          const data = response?.data as Booking;
          const hasBooking = data.event.id === event.id;
          setBooking({
            booking: hasBooking,
            isSuccess: true,
            isLoading: false,
          });
        })
        .catch(() => {
          setAuth({ accessToken: null, refreshToken: null });
        });
    }
  }, [auth, axios, event.id, setAuth]);

  const buttonClickHandler = () => {
    if (auth.accessToken) {
      if (isSuccess && booking) router.push("/user");
      else if (canBook) {
        setBooking((old) => ({ ...old, isLoading: true }));
        axios
          .post(
            `event/${event.id}/booking`,
            {
              referral_link: referral ? referral : undefined,
            },
            {
              headers: { Authorization: `Bearer ${auth.accessToken}` },
            }
          )
          .then(() => {
            setBooking({ booking: true, isSuccess: true, isLoading: false });
            router.push("/user");
          })
          .catch(console.log);
      }
    }
  };

  let buttonText = canBook ? "Accedi per prenotare" : "Prenotazioni chiuse";
  if (auth.accessToken) {
    if (!isSuccess) buttonText = "...";
    if (isSuccess && isLoading) buttonText = "Prenotazione in corso...";
    if (isSuccess && booking) buttonText = "Visualizza prenotazione";
    else buttonText = canBook ? "Prenota" : "Prenotazioni chiuse";
  }
  console.log(auth.accessToken, isSuccess, booking, canBook);
  return (
    <Button
      disabled={
        !auth.accessToken ||
        (!!auth.accessToken && !isSuccess) ||
        (!!auth.accessToken && isSuccess && !booking && !canBook)
      }
      onClick={buttonClickHandler}
      size={Size.large}
      variant={ButtonVariants.contained}
    >
      {buttonText}
    </Button>
  );
}
