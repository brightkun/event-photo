"use client";

import { useGetEvent } from "@/components/hooks/events/useGetEvent";
import { usePostGuest } from "@/components/hooks/guests/usePostGuest";
import { useGuestStore } from "@/components/store/useGuestStore";
import { formatDate } from "@/components/utils/formatDate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./guestJoin.scss";

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(50, "Name is too long"),
});

type FormValues = z.infer<typeof schema>;

interface IProps {
  slug: string;
}

const GuestJoin = ({ slug }: IProps) => {
  const { push } = useRouter();
  const { data: event, isLoading, isError } = useGetEvent(slug);
  const { mutate, isPending, isError: isPostError } = usePostGuest();
  const guest = useGuestStore((state) => state.guests[slug]);
  const setGuest = useGuestStore((state) => state.setGuest);

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
        <p className="state">Loading...</p>
      </section>
    );
  }

  if (isError || !event) {
    return (
      <section id="guestJoin">
        <p className="state">Event is not found</p>
      </section>
    );
  }

  return (
    <section id="guestJoin">
      <form className="joinCard" onSubmit={handleSubmit(onSubmit)}>

        <div className="eventInfo">
          <span className="invited">You are invited to</span>
          <h1 className="title">{event.name}</h1>
          <p className="details">
            {formatDate(event.date)} · {event.location}
          </p>
        </div>

        <div className="field">
          <label>Your name</label>
          <input
            className="input"
            type="text"
            placeholder="Enter your name"
            {...register("name")}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <button className="submitBtn" type="submit" disabled={isPending}>
          {isPending ? "Joining..." : "Continue"}
        </button>
        {isPostError && (
          <span className="error center">Something went wrong, try again</span>
        )}

        <p className="note">No account needed</p>
      </form>
    </section>
  );
};

export default GuestJoin;
