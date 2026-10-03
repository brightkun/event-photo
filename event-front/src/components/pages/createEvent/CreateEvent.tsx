"use client";

import { useRequireUser } from "@/components/hooks/auth/useRequireUser";
import { usePostEvent } from "@/components/hooks/events/usePostEvent";
import { useT } from "@/components/i18n/useT";
import { useOrigin } from "@/components/utils/config";
import { formatDate } from "@/components/utils/formatDate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./createEvent.scss";

const CreateEvent = () => {
  const { t, lang } = useT();
  const { push } = useRouter();
  const origin = useOrigin();
  const { isLoading } = useRequireUser();
  const { mutate, isPending, isError } = usePostEvent();

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, t.create.nameRequired),
        date: z.string().min(1, t.create.dateRequired),
        location: z.string().trim().min(1, t.create.locationRequired),
      }),
    [t],
  );

  type FormValues = z.infer<typeof schema>;

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
  const info = [formatDate(values.date, lang), values.location]
    .filter(Boolean)
    .join(" · ");

  const onSubmit = (body: FormValues) => {
    mutate(body, {
      onSuccess: (event) => push(`/events/${event.slug}/ready`),
    });
  };

  if (isLoading) {
    return (
      <section id="createEvent">
        <p className="state">{t.common.loading}</p>
      </section>
    );
  }

  return (
    <section id="createEvent">
      <div className="createEvent">
        <div className="formSide">
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="title">{t.create.title}</h1>
            <p className="subtitle">{t.create.subtitle}</p>

            <div className="field">
              <label>{t.create.name}</label>
              <input
                className="input"
                type="text"
                placeholder={t.create.namePlaceholder}
                {...register("name")}
              />
              {errors.name && <span className="error">{errors.name.message}</span>}
            </div>

            <div className="field">
              <label>{t.create.date}</label>
              <input className="input" type="date" {...register("date")} />
              {errors.date && <span className="error">{errors.date.message}</span>}
            </div>

            <div className="field">
              <label>{t.create.location}</label>
              <input
                className="input"
                type="text"
                placeholder={t.create.locationPlaceholder}
                {...register("location")}
              />
              {errors.location && (
                <span className="error">{errors.location.message}</span>
              )}
            </div>

            <button className="submitBtn" type="submit" disabled={isPending}>
              {isPending ? t.create.submitting : t.create.submit}
            </button>
            {isError && (
              <span className="error">{t.common.somethingWrong}</span>
            )}
          </form>
        </div>

        <div className="previewSide">
          <div className="previewCard">
            <span className="badge">{t.create.previewBadge}</span>
            <h2 className="previewTitle">
              {values.name.trim() || t.create.previewName}
            </h2>
            <p className="previewInfo">{info || t.create.previewInfo}</p>
            <div className="qrWrap">
              {origin && (
                <QRCodeSVG
                  value={`${origin}/join/preview`}
                  size={203}
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
