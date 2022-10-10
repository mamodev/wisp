import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import styles from "./login.module.scss";
import Button from "../components/base/Button";
import TextField from "../components/base/TextField";
import React, { useState } from "react";
import { isValidEmail } from "../components/utils";
import { AuthContext, axiosForm, axiosJson, useAuth } from "../context/AuthContext";

type FieldValue = { value: string; error: string | boolean };
type FieldState = {
  first_name: FieldValue;
  last_name: FieldValue;
  email: FieldValue;
  password: FieldValue;
};
const defaultState: FieldState = {
  first_name: { value: "", error: false },
  last_name: { value: "", error: false },
  email: { value: "", error: false },
  password: { value: "", error: false },
};

const loginClickable = (fields: FieldState, page: string) =>
  page !== "login" ||
  (fields.password.value && !fields.password.error && fields.email.value && !fields.email.error);

const registerClickable = (fields: FieldState, page: string) =>
  page !== "register" ||
  (fields.password.value &&
    !fields.password.error &&
    fields.email.value &&
    !fields.email.error &&
    fields.first_name.value &&
    !fields.first_name.error &&
    fields.last_name.value &&
    !fields.last_name.error);

const defaultRequestState = { isError: false, isLoading: false };

const Login: NextPageWithLayout = () => {
  const router = useRouter();

  const { setAuth } = useAuth() as AuthContext;

  const [page, setPage] = React.useState<string>("register");
  const [{ isLoading, isError }, setRequest] = React.useState<{
    isLoading: boolean;
    isError: string | boolean;
  }>(defaultRequestState);
  const [field, setField] = useState<FieldState>(defaultState);

  const loginClickHandler = () => {
    if (page === "register") {
      setPage("login");
      setRequest(defaultRequestState);
      return;
    }

    setRequest({ isLoading: true, isError: false });
    axiosJson
      .post("login", {
        email: field.email.value,
        password: field.password.value,
      })
      .then((response) => {
        setRequest({ isLoading: false, isError: false });
        setAuth((old) => ({ ...old, accessToken: response.data?.access_token }));

        if (router.query.next && !Array.isArray(router.query.next)) {
          router.push(router.query.next);
        }
      })
      .catch((error) => setRequest({ isLoading: false, isError: error.response.data.detail }));
  };

  const registerClickHandler = () => {
    if (page === "login") {
      setPage("register");
      setRequest(defaultRequestState);
      return;
    }

    const data = new FormData();
    data.append("email", field.email.value);
    data.append("password", field.password.value);
    data.append("first_name", field.first_name.value);
    data.append("last_name", field.last_name.value);

    setRequest({ isLoading: true, isError: false });

    axiosForm
      .post("registration", data)
      .then((response) => {
        setRequest({ isLoading: false, isError: false });
        setAuth((old) => ({ ...old, accessToken: response.data?.access_token }));

        if (router.query.next && !Array.isArray(router.query.next)) {
          router.push(router.query.next);
        }
      })
      .catch((error) => setRequest({ isLoading: false, isError: error.response.data.detail }));
  };

  const loginButton = (
    <Button disabled={!loginClickable(field, page) || isLoading} onClick={loginClickHandler}>
      Accedi
    </Button>
  );

  const registerButton = (
    <Button disabled={!registerClickable(field, page) || isLoading} onClick={registerClickHandler}>
      Registrati
    </Button>
  );

  return (
    <div className={styles.page_container}>
      <p className="logo big">Where is party?</p>
      <div className={styles.form_container}>
        <p className="title small">Registrati</p>
        {page === "register" && (
          <div className={styles.field_container}>
            <TextField
              value={field.first_name.value}
              error={field.first_name.error}
              placeholder="Nome"
              onChange={(e) =>
                setField((old) => ({
                  ...old,
                  first_name: { value: e.target.value, error: false },
                }))
              }
            />
            <TextField
              value={field.last_name.value}
              error={field.last_name.error}
              placeholder="Cognome"
              onChange={(e) =>
                setField((old) => ({
                  ...old,
                  last_name: { value: e.target.value, error: false },
                }))
              }
            />
            <TextField
              value={field.email.value}
              error={field.email.error}
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setField((old) => ({
                  ...old,
                  email: { value: e.target.value, error: !isValidEmail(e.target.value) },
                }))
              }
            />
            <TextField
              value={field.password.value}
              error={field.password.error}
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setField((old) => ({
                  ...old,
                  password: { value: e.target.value, error: e.target.value.length < 5 },
                }))
              }
            />
          </div>
        )}

        {page === "login" && (
          <div className={styles.field_container}>
            <TextField
              value={field.email.value}
              error={field.email.error}
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setField((old) => ({
                  ...old,
                  email: { value: e.target.value, error: !isValidEmail(e.target.value) },
                }))
              }
            />
            <TextField
              value={field.password.value}
              error={field.password.error}
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setField((old) => ({
                  ...old,
                  password: { value: e.target.value, error: e.target.value.length < 5 },
                }))
              }
            />
          </div>
        )}

        <div className={styles.button_container}>
          {isError && <p className="content small error">{isError}</p>}
          {page === "register" ? (
            <>
              {registerButton}
              <p className="content small">Hai già un account?</p>
              {loginButton}
            </>
          ) : (
            <>
              {loginButton}
              <p className="content small">Non hai ancora un account?</p>
              {registerButton}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

Login.getLayout = function getLayout(page: React.ReactElement) {
  return page;
};

export default Login;
