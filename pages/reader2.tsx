import { NextPageWithLayout } from "./_app";
import styles from "./reader.module.scss";
import React, { useState } from "react";
import {
  BrowserAztecCodeReader,
  BrowserCodeReader,
  IScannerControls,
} from "@zxing/browser";
import Button from "../components/base/Button";
import Dialog from "../components/module/Dialog";
import { PageLayout } from "../components/layout/PageLayout";

type CameraOptions = {
  options: MediaDeviceInfo[];
  selected: MediaDeviceInfo | null;
  error: boolean;
};

const User: NextPageWithLayout = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [cameraDialogOpen, setCameraDialogOpen] =
    React.useState<boolean>(false);
  const [cameraOptions, setCameraOptions] = React.useState<CameraOptions>({
    options: [],
    selected: null,
    error: false,
  });

  const controlsRef = React.useRef<IScannerControls | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const lastResultRef = React.useRef<string | null>(null);
  const socketRef = React.useRef<WebSocket | null>(null);

  const successScan = React.useCallback((ticket: object) => {
    setResult("Biglietto valido");
    setTimeout(() => setResult(null), 1000);
  }, []);
  const failScan = React.useCallback((ticket: object) => {
    setResult("Biglietto NON valido");
    setTimeout(() => setResult(null), 1000);
  }, []);
  const onWebSocketOpen = React.useCallback(() => {
    console.log("connesso");
    setWs(socketRef.current);
  }, []);

  const onWebSocketClose = React.useCallback(() => {
    alert("Disconnesso ricarica la pagina");
    socketRef.current = null;
    setWs(null);
  }, []);

  const onWebSocketMessage = React.useCallback(
    (msg: MessageEvent<object>) => {
      if (msg.data && typeof msg.data === "string") {
        const response = JSON.parse(msg.data);
        let data = response.data;
        const action = response.action;
        if (action === "ticket") {
          setLoading(false);
          if (response.success) {
            successScan(data);
          } else failScan(data);
        }
      }
    },
    [failScan, successScan]
  );

  //SetUp socket
  React.useEffect(() => {
    const ws = new WebSocket(
      "wss://ddlp5kien0.execute-api.eu-west-3.amazonaws.com/production"
    );
    ws.addEventListener("open", onWebSocketOpen);
    ws.addEventListener("close", onWebSocketClose);
    ws.addEventListener("message", onWebSocketMessage);
    socketRef.current = ws;

    return () => {
      ws.removeEventListener("open", onWebSocketOpen);
      ws.removeEventListener("close", onWebSocketClose);
      ws.removeEventListener("message", onWebSocketMessage);
    };
  }, [onWebSocketClose, onWebSocketMessage, onWebSocketOpen]);

  //Load camera options
  React.useEffect(() => {
    const loadCameraOptions = async () => {
      try {
        const videoInputDevices =
          await BrowserCodeReader.listVideoInputDevices();
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

  //setup ZXing
  React.useEffect(() => {
    const setupZXing = async () => {
      if (controlsRef.current) controlsRef.current.stop();

      const codeReader = new BrowserAztecCodeReader(undefined, {
        delayBetweenScanAttempts: 20,
        delayBetweenScanSuccess: 0,
      });

      const previewElem = videoRef.current;

      if (previewElem) {
        const controls = await codeReader.decodeFromVideoDevice(
          cameraOptions.selected?.deviceId,
          previewElem,
          (result, error, controls) => {
            if (
              result?.getText() &&
              result?.getText() !== lastResultRef.current
            ) {
              lastResultRef.current = result.getText();
              if (socketRef.current) {
                setLoading(true);
                socketRef.current.send(
                  JSON.stringify({ action: "ticket", code: result.getText() })
                );
              } else alert("Disconnesso ricarica la pagina");
            }
          }
        );

        if (controls) {
          controlsRef.current = controls;
        }
      }
    };

    if (cameraOptions.selected) setupZXing();
  }, [cameraOptions.selected]);

  //Camera error
  if (cameraOptions.error) {
    return (
      <div className={styles.error_container}>
        <div className="paper">
          <p className="subtitle big bold">
            Impossibile accedere alla fotocamera
          </p>
          <p className="content">
            Prova ad accedere da un altro dispositivo/browser
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div style={{ position: "relative" }}>
        <video
          ref={videoRef}
          width="100%"
          height="100%"
          style={{ border: "1px solid black" }}
        />
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <p className="content">Caricamento...</p>
            </div>
          </div>
        )}
        {result && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <p className="content">{result}</p>
            </div>
          </div>
        )}
      </div>

      <div className={styles.cameraSelect_container}>
        <Button
          onClick={() => {
            setCameraDialogOpen(true);
          }}
        >
          Scegli camera
        </Button>
      </div>

      <Dialog
        open={cameraDialogOpen}
        onClose={() => setCameraDialogOpen(false)}
      >
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

      <Button
        onClick={() => {
          if (ws) {
            ws.send(JSON.stringify({ action: "ticket", code: "TT44I" }));
          }
        }}
      >
        Send
      </Button>
    </div>
  );
};

User.getLayout = function getLayout(page: React.ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default User;
