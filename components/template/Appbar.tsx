import { useRouter } from "next/router";
import { AuthContext, axiosJson, useAuth } from "../../context/AuthContext";
import Button, { ButtonVariants } from "../base/Button";
import styles from "./Appbar.module.scss";

const Appbar = (): JSX.Element => {
  const {
    auth: { accessToken },
    setAuth,
  } = useAuth() as AuthContext;

  const router = useRouter();

  const buttonClickHandler = () => {
    if (!accessToken) router.push(`/login?next=${router.asPath}`);
    else
      axiosJson
        .get("logout", { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(() => setAuth((old) => ({ ...old, accessToken: null })))
        .catch(console.log);
  };

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <h1 className="logo">Where is party?</h1>
        <div className={styles.button_container}>
          <Button variant={ButtonVariants.text} onClick={buttonClickHandler}>
            {accessToken ? "Esci" : "Accedi"}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Appbar;
