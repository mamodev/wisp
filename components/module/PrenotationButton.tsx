import { useRouter } from "next/router";
import React from "react";
import { AuthContext, axiosJson, useAuth } from "../../context/AuthContext";
import { Size } from "../../types/components/Utils";
import Button, { ButtonProps, ButtonVariants } from "../base/Button";

type BookingState = { booking: boolean; isSuccess: boolean; isLoading: boolean };
const defaultbookingState = { booking: false, isSuccess: false, isLoading: false };

export default function PrenotationButton({ id }: { id: string }) {
  const { auth, setAuth } = useAuth() as AuthContext;
  const router = useRouter();
  const referral = router.query.ref;

  const [{ booking, isSuccess, isLoading }, setBooking] =
    React.useState<BookingState>(defaultbookingState);

  React.useEffect(() => {
    if (auth.accessToken) {
      setBooking((old) => ({ ...old, isLoading: true }));
      axiosJson
        .get("user/booking", { headers: { Authorization: `Bearer ${auth.accessToken}` } })
        .then((response) => {
          setBooking({ booking: response.data !== "", isSuccess: true, isLoading: false });
        })
        .catch(console.log);
    }
  }, [auth]);

  const buttonClickHandler = () => {
    if (auth.accessToken) {
      if (isSuccess && booking) router.push("/user");
      else {
        // TEMPORARY BLOCK
        // setBooking((old) => ({ ...old, isLoading: true }));
        // axiosJson
        //   .post(
        //     `event/${id}/booking`,
        //     {
        //       referral_link: referral ? referral : undefined,
        //     },
        //     {
        //       headers: { Authorization: `Bearer ${auth.accessToken}` },
        //     }
        //   )
        //   .then(() => {
        //     setBooking({ booking: true, isSuccess: true, isLoading: false });
        //     router.push("/user");
        //   })
        //   .catch(console.log);
      }
    }
  };

  //TEMPORARY BLOCK
  // let buttonText = "Accedi per prenotare";
  // if (auth.accessToken) {
  //   if (!isSuccess) buttonText = "...";
  //   if (isSuccess && isLoading) buttonText = "Prenotazione in corso...";
  //   if (isSuccess && booking) buttonText = "Visualizza prenotazione";
  //   else buttonText = "Prenota";
  // }

  let buttonText = "Prenotazioni chiuse";
  if (auth.accessToken) {
    if (!isSuccess) buttonText = "...";
    if (isSuccess && isLoading) buttonText = "...";
    if (isSuccess && booking) buttonText = "Visualizza prenotazione";
    else buttonText = "Prenotazioni chiuse";
  }

  return (
    <Button
      disabled={
        !auth.accessToken ||
        (!!auth.accessToken && !isSuccess) ||
        (!!auth.accessToken && isSuccess && !booking)
      }
      onClick={buttonClickHandler}
      size={Size.large}
      variant={ButtonVariants.contained}
    >
      {buttonText}
    </Button>
  );
}
