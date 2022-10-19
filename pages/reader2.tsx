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

type CameraOptions = {
  options: MediaDeviceInfo[];
  selected: MediaDeviceInfo | null;
  error: boolean;
};

const User: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string[]>([]);
  const [cameraDialogOpen, setCameraDialogOpen] = React.useState<boolean>(false);
  const [cameraOptions, setCameraOptions] = React.useState<CameraOptions>({
    options: [],
    selected: null,
    error: false,
  });

  const controlsRef = React.useRef<IScannerControls | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const lastResultRef = React.useRef<string | null>(null);

  //Load camera options
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
            if (result?.getText() && result?.getText() !== lastResultRef.current) {
              lastResultRef.current = result.getText();

              setResult((old) => [result.getText(), ...old]);
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

      <div>
        {result.map((time, key) => (
          <p key={key} style={{ backgroundColor: "white", paddingBlock: "10px" }}>
            {time}
          </p>
        ))}
      </div>
    </div>
  );
};

User.getLayout = function getLayout(page: React.ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default User;
