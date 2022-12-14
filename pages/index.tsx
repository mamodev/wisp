import { PageLayout } from "../components/layout/PageLayout";
import { NextPageWithLayout } from "./_app";
import styles from "./index.module.scss";

const Home: NextPageWithLayout = () => {
  return <div className={styles.map_container}></div>;
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default Home;
