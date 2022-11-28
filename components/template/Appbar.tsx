import { useRouter } from "next/router";
import { AuthContext, useAuth } from "../../context/AuthContext";
import useAxiosAuth from "../../hooks/useAuthAxios";
import Button, { ButtonVariants } from "../base/Button";
import styles from "./Appbar.module.scss";

export default function Appbar() {
  const { auth, setAuth } = useAuth() as AuthContext;

  const router = useRouter();
  const axios = useAxiosAuth({});

  const buttonClickHandler = () => {
    if (!auth.accessToken) router.push(`/login?next=${router.asPath}`);
    else
      axios
        .get("logout", {
          headers: { Authorization: `Bearer ${auth.accessToken}` },
        })
        .then(() => setAuth((old) => ({ ...old, accessToken: null })))
        .catch((err) => {
          console.log(err);
          setAuth((old) => ({ ...old, accessToken: null }));
        });
  };

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <h1 className="logo">Where is party?</h1>
        <div className={styles.button_container}>
          <Button variant={ButtonVariants.text} onClick={buttonClickHandler}>
            {auth.accessToken ? "Esci" : "Accedi"}
          </Button>
        </div>
      </div>
    </div>
  );
}
