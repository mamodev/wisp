import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import styles from "./login.module.scss";
import Button from "../components/base/Button";
import TextField from "../components/base/TextField";
const Login: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <div className={styles.page_container}>
      <div className={styles.form_container}>
        <p>Registrati</p>
        <div>
          <TextField placeholder="Nome" />
        </div>

        <div>
          <Button>Registrati</Button>
          <p>Hai già un account?</p>
          <Button>Accedi</Button>
        </div>
      </div>
    </div>
  );
};

Login.getLayout = function getLayout(page: React.ReactElement) {
  return page;
};

export default Login;
