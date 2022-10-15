import React from "react";
import { createPortal } from "react-dom";

export type PortalProps = {
  container?: HTMLElement;
  children?: React.ReactNode;
  el?: string;
  className?: string;
  id?: string;
};

export default function Portal({ container, children, el = "div", className, id }: PortalProps) {
  const [containerRef, setContainerRef] = React.useState<HTMLElement | undefined>(container);

  React.useEffect(() => {
    if (!container) {
      const element = document.createElement(el);
      setContainerRef(element);
      if (id) element.id = id;
      document.body.appendChild(element);
      className?.split(" ").forEach((str) => element.classList.add(str));

      return () => {
        document.body.removeChild(element);
      };
    }
  }, [className, container, el, id]);

  if (containerRef) return createPortal(children, containerRef);
  return <></>;
}
