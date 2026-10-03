"use client";

import { useGetEvent } from "@/components/hooks/events/useGetEvent";
import { usePostGuest } from "@/components/hooks/guests/usePostGuest";
import { useT } from "@/components/i18n/useT";
import { useGuestStore } from "@/components/store/useGuestStore";
import { formatDate } from "@/components/utils/formatDate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./guestJoin.scss";

interface IProps {
  slug: string;
}

const GuestJoin = ({ slug }: IProps) => {
  const { t, lang } = useT();
  const { push } = useRouter();
  const { data: event, isLoading, isError } = useGetEvent(slug);
  const { mutate, isPending, isError: isPostError } = usePostGuest();
  const guest = useGuestStore((state) => state.guests[slug]);
  const setGuest = useGuestStore((state) => state.setGuest);

  const schema = useMemo(
    () =>
      z.object({
        name: z
          .string()
          .trim()
          .min(1, t.join.nameRequired)
          .max(50, t.join.nameLong),
      }),
    [t],
  );

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (guest) setValue("name", guest.name);
  }, [guest, setValue]);

  const onSubmit = (body: FormValues) => {
    if (guest && guest.name === body.name) {
      push(`/events/${slug}`);
      return;
    }

    mutate(
      { slug, body },
      {
        onSuccess: (data) => {
          setGuest(slug, { id: data.id, name: data.name, token: data.token });
          push(`/events/${slug}`);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <section id="guestJoin">
        <p className="state">{t.common.loading}</p>
      </section>
    );
  }

  if (isError || !event) {
    return (
      <section id="guestJoin">
        <p className="state">{t.common.eventNotFound}</p>
      </section>
    );
  }

  return (
    <section id="guestJoin">
      <form className="joinCard" onSubmit={handleSubmit(onSubmit)}>

        <div className="eventInfo">
          <span className="invited">{t.join.invited}</span>
          <h1 className="title">{event.name}</h1>
          <p className="details">
            {formatDate(event.date, lang)} · {event.location}
          </p>
        </div>

        <div className="field">
          <label>{t.join.yourName}</label>
          <input
            className="input"
            type="text"
            placeholder={t.join.namePlaceholder}
            {...register("name")}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <button className="submitBtn" type="submit" disabled={isPending}>
          {isPending ? t.join.submitting : t.join.submit}
        </button>
        {isPostError && (
          <span className="error center">{t.common.somethingWrong}</span>
        )}

        <p className="note">{t.join.note}</p>
      </form>
    </section>
  );
};

export default GuestJoin;
