import { NextPageWithLayout } from "./_app";
import styles from "./reader.module.scss";
import { useEffect, useState } from "react";

const User: NextPageWithLayout = () => {
  const [data, setData] = useState("No qwe");

  return (
    <div className={styles.container}>
      <p>{data}</p>
    </div>
  );
};

User.getLayout = function getLayout(page: React.ReactElement) {
  return page;
};

export default User;
