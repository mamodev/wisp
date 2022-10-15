import { NextPageWithLayout } from "./_app";
import styles from "./reader.module.scss";
import React, { useEffect, useState } from "react";
import { BrowserCodeReader, BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import Button from "../components/base/Button";
import Dialog from "../components/module/Dialog";
import { PageLayout } from "../components/layout/PageLayout";
import { Colors } from "../types/components/Utils";
import axios from "axios";

type CameraOptions = {
  options: MediaDeviceInfo[];
  selected: MediaDeviceInfo | null;
  error: boolean;
};

type ResultProps = {
  first_name: string;
  last_name: string;
  id: string;
  code: string;
};
const User: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultProps | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [cameraDialogOpen, setCameraDialogOpen] = React.useState<boolean>(false);
  const [cameraOptions, setCameraOptions] = React.useState<CameraOptions>({
    options: [],
    selected: null,
    error: false,
  });

  const controlsRef = React.useRef<IScannerControls | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const socketRef = React.useRef<WebSocket | null>(null);

  const onWebSocketOpen = React.useCallback(() => {
    console.log("connected");
    setWs(socketRef.current);
  }, []);

  const onWebSocketClose = React.useCallback(() => {
    console.log("disconnected");
    socketRef.current = null;
    setWs(null);
  }, []);

  const onWebSocketMessage = React.useCallback((msg: MessageEvent<object>) => {
    if (msg.data && typeof msg.data === "string") {
      const response = JSON.parse(msg.data);
      let data = response.data;
      const action = response.action;
      if (action === "scanTicket") {
        if (data.length > 0) {
          data = data[0];
          setResult({ ...data, code: response.code });
        }
      }
      if (action === "enterTicket") {
        setLoading(false);
        setResult(null);
      }
    }
  }, []);

  //SetUp socket
  React.useEffect(() => {
    const ws = new WebSocket("wss://ddlp5kien0.execute-api.eu-west-3.amazonaws.com/production");
    ws.addEventListener("open", onWebSocketOpen);
    ws.addEventListener("close", onWebSocketClose);
    ws.addEventListener("message", onWebSocketMessage);
    socketRef.current = ws;

    return () => {
      ws.close();
      ws.removeEventListener("open", onWebSocketOpen);
      ws.removeEventListener("close", onWebSocketClose);
      ws.removeEventListener("message", onWebSocketMessage);
    };
  }, [onWebSocketClose, onWebSocketMessage, onWebSocketOpen]);

  React.useEffect(() => {
    const loadCameraOptions = async () => {
      try {
        const videoInputDevices = await BrowserCodeReader.listVideoInputDevices();
        setCameraOptions({
          options: videoInputDevices,
          selected: videoInputDevices?.[0],
          error: false,
        });
      } catch {
        setCameraOptions({ options: [], selected: null, error: true });
      }
    };

    loadCameraOptions();
  }, []);

  React.useEffect(() => {
    const setupZXing = async () => {
      if (controlsRef.current) controlsRef.current.stop();

      const codeReader = new BrowserQRCodeReader(undefined, { delayBetweenScanAttempts: 10 });

      const previewElem = videoRef.current;

      if (previewElem) {
        const controls = await codeReader.decodeFromVideoDevice(
          cameraOptions.selected?.deviceId,
          previewElem,
          (result, error, controls) => {
            if (result?.getText() && result?.getText().length === 5) {
              if (socketRef.current) {
                socketRef.current.send(
                  JSON.stringify({ action: "scanTicket", code: result.getText() })
                );
              }
            }
            //controls.stop();
          }
        );

        if (controls) {
          controlsRef.current = controls;
        }
      }
    };

    if (cameraOptions.selected) setupZXing();
  }, [cameraOptions.selected]);

  if (cameraOptions.error) {
    return (
      <div className={styles.error_container}>
        <div className="paper">
          <p className="subtitle big bold">Impossibile accedere alla fotocamera</p>
          <p className="content">Prova ad accedere da un altro dispositivo/browser</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        style={{ border: "1px solid black" }}
      ></video>

      <div className={styles.cameraSelect_container}>
        <Button
          onClick={() => {
            setCameraDialogOpen(true);
          }}
        >
          Scegli camera
        </Button>
      </div>

      <Dialog open={cameraDialogOpen} onClose={() => setCameraDialogOpen(false)}>
        {cameraOptions.options.map((option, i) => (
          <p
            className={styles.list}
            key={i}
            onClick={() => {
              setCameraOptions((old) => ({ ...old, selected: option }));
              setCameraDialogOpen(false);
            }}
          >
            {option.label}
          </p>
        ))}
      </Dialog>

      <Dialog open={!!result}>
        <div className={styles.result_container}>
          <p className="title bold" style={{ textAlign: "center" }}>
            Biglietto valido
          </p>
          <p className="subtitle " style={{ textAlign: "center" }}>
            {result?.code}
          </p>
          <p className="subtitle" style={{ textAlign: "center" }}>
            <span className="bold"> Nome:</span> {result?.first_name}
          </p>
          <p className="subtitle" style={{ textAlign: "center" }}>
            <span className="bold"> Cognome:</span> {result?.last_name}
          </p>
          <Button
            onClick={() => {
              axios.get(`https://api.countapi.xyz/hit/whereisparty.it/${result?.code}`);
              setResult(null);
            }}
          >
            Entra
          </Button>
          <Button color={Colors.error} onClick={() => setResult(null)}>
            Annulla
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

User.getLayout = function getLayout(page: React.ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default User;
