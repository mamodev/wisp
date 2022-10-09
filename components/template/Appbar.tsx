import { useRouter } from "next/router";
import Button, { ButtonVariants } from "../base/Button";
import styles from "./Appbar.module.scss";

const Appbar = (): JSX.Element => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <h1 className="title">Where is the party</h1>
        <Button
          variant={ButtonVariants.contained}
          onClick={() => router.push(`/login?next=${router.asPath}`)}
        >
          Accedi
        </Button>
      </div>
    </div>
  );
};
export default Appbar;
