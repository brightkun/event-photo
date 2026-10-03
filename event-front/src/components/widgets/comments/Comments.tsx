"use client";

import { useGetComments } from "@/components/hooks/comments/useGetComments";
import { usePostComment } from "@/components/hooks/comments/usePostComment";
import { useGuest } from "@/components/hooks/guests/useGuest";
import { useT } from "@/components/i18n/useT";
import { FormEvent, useEffect, useRef, useState } from "react";
import "./comments.scss";

interface IProps {
  slug: string;
  photoId: string;
}


const Comments = ({ slug, photoId }: IProps) => {
  const { t } = useT();
  const { guest, requireGuest } = useGuest(slug);
  const { data: comments = [] } = useGetComments(slug, photoId);
  const { mutate, isPending } = usePostComment();
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [comments.length]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const value = text.trim();
    const currentGuest = requireGuest();
    if (!value || !currentGuest) return;

    mutate(
      { slug, photoId, token: currentGuest.token, text: value },
      { onSuccess: () => setText("") },
    );
  };

  return (
    <div className="comments">
      <h3 className="title">{t.photo.comments} · {comments.length}</h3>

      <div className="list" ref={listRef}>
        {comments.map((comment) => (
          <div className="comment" key={comment.id}>
            <div className="avatar">{comment.guest_name[0]?.toUpperCase()}</div>
            <div className="body">
              <span className="name">{comment.guest_name}</span>
              <span className="text">{comment.text}</span>
            </div>
          </div>
        ))}
      </div>

      <form className="form" onSubmit={onSubmit}>
        <input
          className="input"
          type="text"
          placeholder={t.photo.commentPlaceholder}
          maxLength={500}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => {
            if (!guest) requireGuest();
          }}
        />
        <button
          className="sendBtn"
          type="submit"
          disabled={isPending || !text.trim()}
          aria-label={t.photo.send}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 19V5M5 12l7-7 7 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Comments;
