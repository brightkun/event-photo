"use client";

import { usePostEvent } from "@/components/hooks/events/usePostEvent";
import { useOrigin } from "@/components/utils/config";
import { formatDate } from "@/components/utils/formatDate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./createEvent.scss";

const schema = z.object({
  name: z.string().trim().min(1, "Enter event name"),
  date: z.string().min(1, "Choose a date"),
  location: z.string().trim().min(1, "Enter location"),
});

type FormValues = z.infer<typeof schema>;

const CreateEvent = () => {
  const { push } = useRouter();
  const origin = useOrigin();
  const { mutate, isPending, isError } = usePostEvent();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", date: "", location: "" },
  });

  const values = watch();
  const info = [formatDate(values.date), values.location]
    .filter(Boolean)
    .join(" · ");

  const onSubmit = (body: FormValues) => {
    mutate(body, {
      onSuccess: (event) => push(`/events/${event.slug}/ready`),
    });
  };

  return (
    <section id="createEvent">
      <div className="createEvent">
        <div className="formSide">
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="title">Create your event</h1>
            <p className="subtitle">
              Get a QR code. Guests scan it and share photos in one live feed.
            </p>

            <div className="field">
              <label>Event name</label>
              <input
                className="input"
                type="text"
                placeholder="Anna & Timur Wedding"
                {...register("name")}
              />
              {errors.name && <span className="error">{errors.name.message}</span>}
            </div>

            <div className="field">
              <label>Date</label>
              <input className="input" type="date" {...register("date")} />
              {errors.date && <span className="error">{errors.date.message}</span>}
            </div>

            <div className="field">
              <label>Location</label>
              <input
                className="input"
                type="text"
                placeholder="Bishkek"
                {...register("location")}
              />
              {errors.location && (
                <span className="error">{errors.location.message}</span>
              )}
            </div>

            <button className="submitBtn" type="submit" disabled={isPending}>
              {isPending ? "Generating..." : "Generate QR"}
            </button>
            {isError && (
              <span className="error">Something went wrong, try again</span>
            )}
          </form>
        </div>

        <div className="previewSide">
          <div className="previewCard">
            <span className="badge">Live preview</span>
            <h2 className="previewTitle">
              {values.name.trim() || "Your event name"}
            </h2>
            <p className="previewInfo">{info || "Date · Location"}</p>
            <div className="qrWrap">
              {origin && (
                <QRCodeSVG
                  value={`${origin}/join/preview`}
                  size={231}
                  level="M"
                  marginSize={0}
                  fgColor="#1c1a17"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateEvent;
