import { Wrapper } from "@googlemaps/react-wrapper";
import React from "react";
import { GeoPoint } from "../../types/api/Location";
import { HEX, HSL } from "../../types/Utils";
import { hexToRgb, HSLToRGB, rgbToHex, RGBToHSL } from "../utils";

let color: HEX[] = [
  "#1d2c4d",
  "#8ec3b9",
  "#1a3646",
  "#4b6878",
  "#3C7680",
  "#334e87",
  "#023e58",
  "#2c6675",
  "#283d6a",
  "#304a7d",
  "#6f9ba5",
  "#98a5be",
  "#255763",
  "#b0d5ce",
  "#4e6d70",
  "#0e1626",
  "#3a4762",
];

export type EventMapProps = {
  position: GeoPoint;
  height?: number | string;
  primary: HEX;
  secondary: HEX;
  background?: HEX;
  name: string;
};
// process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
export default function EventMaps(props: EventMapProps) {
  return (
    <Wrapper apiKey={"AIzaSyB4LsplwzPFVG8XAYDtVA5iAtROTFzdwpc"}>
      <Map {...props} />
    </Wrapper>
  );
}

function Map({
  primary,
  secondary,
  name,
  position,
  background,
  height = 200,
}: EventMapProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      const map = new window.google.maps.Map(ref.current, {
        center: new google.maps.LatLng(position[0], position[1]),
        zoom: 17,
        disableDefaultUI: true,
        clickableIcons: false,
        backgroundColor: "black",
        styles: config(primary, secondary),
      });

      const markerImage: google.maps.Symbol = {
        path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
        fillOpacity: 1,
        fillColor: primary,
        strokeWeight: 2,
        strokeColor: secondary,
        scale: 1.5,
        labelOrigin: new google.maps.Point(12, -5),
      };

      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(position[0], position[1]),
        label: { text: name, color: primary },
        map: map,
        icon: markerImage,
      });
    }
  }, [name, position, primary, secondary]);

  return (
    <div
      ref={ref}
      id="map"
      style={{ height: `${height}px`, width: "100%", backgroundColor: "white" }}
    />
  );
}

function config(primary: HEX, secondary: HEX) {
  //Find the darker color of the palette
  let darkerColor = { color: "", b: 100 };
  for (let c of color) {
    const brightness = RGBToHSL(hexToRgb(c))[2];
    if (brightness < darkerColor.b) darkerColor = { color: c, b: brightness };
  }

  //Map colors to primary and secondary colors
  color = color.map((currentColor) => {
    const a: HSL = RGBToHSL(hexToRgb(currentColor));
    const b: HSL = RGBToHSL(hexToRgb(secondary));
    const newColor: HSL = [b[0], b[1], a[2]];
    const color_hex: HEX = rgbToHex(HSLToRGB(newColor));
    return color_hex;
  });

  //return the map theme
  return [
    {
      elementType: "geometry",
      stylers: [
        {
          color: color[0],
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: color[1],
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: color[2],
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: color[3],
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: color[3],
        },
      ],
    },
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: color[3],
        },
      ],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: color[5],
        },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        {
          color: color[6],
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: color[8],
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: color[10],
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: color[0],
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [
        {
          color: color[8],
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: color[4],
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: color[9],
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: color[11],
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: color[0],
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: color[7],
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: color[12],
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: color[13],
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: color[6],
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: color[11],
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: color[0],
        },
      ],
    },
    {
      featureType: "transit.line",
      elementType: "geometry.fill",
      stylers: [
        {
          color: color[8],
        },
      ],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [
        {
          color: color[16],
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: color[15],
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: color[14],
        },
      ],
    },
    {
      elementType: "labels.icon",
      stylers: [
        {
          color: primary,
        },
      ],
    },
  ];
}
