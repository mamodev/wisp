import { NextPageWithLayout } from "./_app";
import styles from "./reader.module.scss";
import React, { useEffect, useState } from "react";
import { BrowserCodeReader, BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import Button from "../components/base/Button";
import Dialog from "../components/module/Dialog";
import { PageLayout } from "../components/layout/PageLayout";

type CameraOptions = {
  options: MediaDeviceInfo[];
  selected: MediaDeviceInfo | null;
  error: boolean;
};

const User: NextPageWithLayout = () => {
  const [result, setResult] = useState("Scan");
  const [cameraDialogOpen, setCameraDialogOpen] = React.useState<boolean>(false);
  const [cameraOptions, setCameraOptions] = React.useState<CameraOptions>({
    options: [],
    selected: null,
    error: false,
  });

  const controlsRef = React.useRef<IScannerControls | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

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
            if (result?.getText()) alert(result?.getText());
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

      <Button
        onClick={() => {
          setCameraDialogOpen(true);
        }}
      >
        Scegli camera
      </Button>

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
      <p style={{ color: "white" }}>{result}</p>
    </div>
  );
};

User.getLayout = function getLayout(page: React.ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default User;
