"use client";

import { useGuest } from "@/components/hooks/guests/useGuest";
import { IReaction } from "@/components/hooks/photos/useGetPhoto";
import { useToggleReaction } from "@/components/hooks/reactions/useToggleReaction";
import "./reactions.scss";

interface IProps {
  slug: string;
  photoId: string;
  reactions: IReaction[];
}

const Reactions = ({ slug, photoId, reactions }: IProps) => {
  const { requireGuest } = useGuest(slug);
  const { mutate, isPending } = useToggleReaction();

  const onClick = (emoji: string) => {
    const guest = requireGuest();
    if (!guest) return;

    mutate({ slug, photoId, token: guest.token, emoji });
  };

  return (
    <div className="reactions">
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          className={reaction.reacted ? "pill active" : "pill"}
          onClick={() => onClick(reaction.emoji)}
          disabled={isPending}
        >
          <span className="emoji">{reaction.emoji}</span>
          {reaction.count}
        </button>
      ))}
    </div>
  );
};

export default Reactions;
