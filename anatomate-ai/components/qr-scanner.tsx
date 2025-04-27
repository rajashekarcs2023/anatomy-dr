"use client";

import { Html5Qrcode } from "html5-qrcode";
import { Camera, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

interface QrScannerProps {
  onScan: (data: string | null) => void;
}

export function QrScanner({ onScan }: QrScannerProps) {
  const [isIOS, setIsIOS] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    if (!containerRef.current || iOS) return;

    // Only try camera scanning on non-iOS devices
    const qrScanner = new Html5Qrcode("qr-reader");
    scannerRef.current = qrScanner;

    qrScanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
          qrScanner.stop();
        },
        (error) => {
          console.error("QR Code scanning error:", error);
        }
      )
      .catch((err) => {
        console.error("Failed to start scanner:", err);
        setIsIOS(true); // Fallback to file upload if camera fails
      });

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch((err) => console.error("Failed to stop scanner:", err));
      }
    };
  }, [onScan]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const qrScanner = new Html5Qrcode("qr-reader");
    try {
      const result = await qrScanner.scanFile(file, true);
      onScan(result);
    } catch (error) {
      console.error("Error scanning file:", error);
      onScan(null);
    } finally {
      qrScanner.clear();
    }
  };

  if (isIOS) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-4">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-sm flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Camera className="w-5 h-5" />
          Take Photo of QR Code
        </Button>
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="w-full max-w-sm flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload QR Code Image
        </Button>
        <p className="text-sm text-gray-500 text-center mt-2">
          Please use your camera to scan the QR code or upload an image
        </p>
      </div>
    );
  }

  return <div id="qr-reader" ref={containerRef} className="w-full h-full" />;
}
