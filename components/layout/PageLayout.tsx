import Appbar from "../template/Appbar";
import styles from "./PageLayout.module.scss";

type PageLayoutProps = {
  children: React.ReactNode;
};

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className={styles.container}>
      <Appbar />
      {children}
    </div>
  );
};
