import React from "react";
import Portal from "../layout/Portal";
import styles from "./Dialog.module.scss";

export type DialogProps = { open: boolean; onClose?: () => any; children: React.ReactNode };
export default function Dialog({ open, onClose: close, children }: DialogProps) {
  return (
    <Portal>
      {open && (
        <div className={styles.dialog_container} onClick={close}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </Portal>
  );
}
