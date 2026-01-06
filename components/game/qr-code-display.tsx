"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function QRCodeDisplay({
  sessionId,
  code,
}: {
  sessionId: string;
  code: string;
}) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/player?session=${code}`;
    QRCode.toDataURL(url, { width: 300, margin: 2 })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [code]);

  if (!qrDataUrl) return null;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl">
      <img src={qrDataUrl} alt="QR Code" className="w-full" />
    </div>
  );
}
