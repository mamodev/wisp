import React from "react";
import { GeoPoint } from "../types/api/Location";

export type PositionState = GeolocationPosition | null;

export default function usePosition() {
  const [error, setPermission] = React.useState<string | null>(null);
  const [position, setPosition] = React.useState<PositionState>(null);

  React.useEffect(() => {
    askPermission();
  }, []);

  React.useEffect(() => {
    if (error === "grant" || "prompt") {
      const whatcher = navigator.geolocation.watchPosition(
        (position: GeolocationPosition) => setPosition(position),
        () => {
          setPermission("denied");
        }
      );

      return () => navigator.geolocation.clearWatch(whatcher);
    }
  }, [error]);

  const askPermission = () => {
    navigator.permissions
      .query({
        name: "geolocation",
      })
      .then((result) => setPermission(result.state))
      .catch(() => setPermission("denied"));
  };

  return { position, error, askPermission };
}
