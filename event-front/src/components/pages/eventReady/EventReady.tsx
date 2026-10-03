"use client";

import { useGetEvent } from "@/components/hooks/events/useGetEvent";
import { useT } from "@/components/i18n/useT";
import { useOrigin } from "@/components/utils/config";
import { formatDate } from "@/components/utils/formatDate";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import "./eventReady.scss";

interface IProps {
  slug: string;
}

const EventReady = ({ slug }: IProps) => {
  const { t, lang } = useT();
  const { push } = useRouter();
  const origin = useOrigin();
  const { data: event, isLoading, isError } = useGetEvent(slug);
  const qrRef = useRef<HTMLDivElement>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const joinUrl = `${origin}/join/${slug}`;
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(
    origin,
  );

  const downloadQr = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${slug}-qr.png`;
    link.click();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    setTimeout(() => setCopyState("idle"), 2000);
  };

  if (isLoading) {
    return (
      <section id="eventReady">
        <p className="state">{t.common.loading}</p>
      </section>
    );
  }

  if (isError || !event) {
    return (
      <section id="eventReady">
        <p className="state">{t.common.eventNotFound}</p>
      </section>
    );
  }

  return (
    <section id="eventReady">
      <div className="eventReady">
        <div className="info">
          <span className="badge">{t.ready.badge}</span>
          <h1 className="title">{event.name}</h1>
          <p className="details">
            {formatDate(event.date, lang)} · {event.location}
          </p>
          <p className="hint">{t.ready.hint}</p>
          {isLocal && <p className="warning">{t.ready.localWarning}</p>}

          <div className="actions">
            <button className="primaryBtn" onClick={downloadQr}>
              {t.ready.downloadQr}
            </button>
            <div className="secondary">
              <button className="secondaryBtn" onClick={copyLink}>
                {copyState === "copied" && t.ready.copied}
                {copyState === "failed" && t.ready.copyFailed}
                {copyState === "idle" && t.ready.copyLink}
              </button>
              <button
                className="secondaryBtn"
                onClick={() => push(`/events/${slug}`)}
              >
                {t.ready.openWall}
              </button>
            </div>
          </div>
        </div>

        <div className="qrCard" ref={qrRef}>
          {origin && (
            <QRCodeCanvas
              value={joinUrl}
              size={315}
              level="M"
              marginSize={0}
              fgColor="#1c1a17"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default EventReady;
