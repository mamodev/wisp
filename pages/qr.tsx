import { NextPageWithLayout } from "./_app";
import styles from "./reader.module.scss";
import React, { useEffect, useState } from "react";
import {
  BrowserAztecCodeReader,
  BrowserCodeReader,
  BrowserQRCodeReader,
  IScannerControls,
} from "@zxing/browser";
import Button from "../components/base/Button";
import Dialog from "../components/module/Dialog";
import { PageLayout } from "../components/layout/PageLayout";
import { Colors } from "../types/components/Utils";
import QRCode from "react-qr-code";
import AztecCode from "../components/module/AztecCode";

type CameraOptions = {
  options: MediaDeviceInfo[];
  selected: MediaDeviceInfo | null;
  error: boolean;
};

function makeid(length: number): string {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const tickets = [
  "VAJWJ",
  "TT44I",
  "HSCDC",
  "7I6SC",
  "UEDWF",
  "V39HZ",
  "8BXQI",
  "IA8C4",
  "0F2NG",
  "5B0NP",
  "5VGZ0",
  "MCV61",
  "DI3F4",
  "3KZ5R",
  "VLYLM",
];
let counter = 0;
const User: NextPageWithLayout = () => {
  const [code, setCode] = useState<string>(tickets[0]);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div style={{ padding: "10px", backgroundColor: "white", maxWidth: "300px" }}>
        <AztecCode code={code} />
      </div>

      <div>
        <Button
          onClick={() => {
            counter++;
            setCode(tickets[counter]);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

User.getLayout = function getLayout(page: React.ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default User;
