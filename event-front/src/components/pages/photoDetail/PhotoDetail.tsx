"use client";

import { useGuest } from "@/components/hooks/guests/useGuest";
import { useDeletePhoto } from "@/components/hooks/photos/useDeletePhoto";
import { useGetPhoto } from "@/components/hooks/photos/useGetPhoto";
import { useRealtime } from "@/components/hooks/realtime/useRealtime";
import { timeAgo } from "@/components/utils/timeAgo";
import Comments from "@/components/widgets/comments/Comments";
import Reactions from "@/components/widgets/reactions/Reactions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./photoDetail.scss";

interface IProps {
  slug: string;
  photoId: string;
}


const PhotoDetail = ({ slug, photoId }: IProps) => {
  useRealtime(slug);
  const { push } = useRouter();
  const { guest } = useGuest(slug);
  const {
    data: photo,
    isLoading,
    isError,
  } = useGetPhoto(slug, photoId, guest?.token);
  const { mutate, isPending } = useDeletePhoto();

  const onDelete = () => {
    if (!guest || !window.confirm("Delete this photo?")) return;

    mutate(
      { slug, photoId, token: guest.token },
      { onSuccess: () => push(`/events/${slug}`) },
    );
  };

  if (isLoading) {
    return (
      <section id="photoDetail">
        <p className="state">Loading...</p>
      </section>
    );
  }

  if (isError || !photo) {
    return (
      <section id="photoDetail">
        <p className="state">Photo is not found</p>
      </section>
    );
  }

  return (
    <section id="photoDetail">
      <div className="mobileBar">
        <Link
          href={`/events/${slug}`}
          className="backLink"
          aria-label="Back to wall"
        >
          ‹
        </Link>
        {photo.is_owner && (
          <button
            className="mobileDelete"
            onClick={onDelete}
            disabled={isPending}
          >
            Delete
          </button>
        )}
      </div>

      <div className="stage">
        <img
          className="photo"
          src={photo.url}
          alt={`Photo by ${photo.guest_name}`}
        />
      </div>

      <aside className="side">
        <div className="author">
          <div className="avatar">{photo.guest_name[0]?.toUpperCase()}</div>
          <div className="meta">
            <span className="name">{photo.guest_name}</span>
            <span className="time">{timeAgo(photo.created_at)}</span>
          </div>
          {photo.is_owner && (
            <button
              className="deleteBtn"
              onClick={onDelete}
              disabled={isPending}
            >
              Delete
            </button>
          )}
        </div>

        <Reactions slug={slug} photoId={photoId} reactions={photo.reactions} />
        <Comments slug={slug} photoId={photoId} />
      </aside>
    </section>
  );
};

export default PhotoDetail;
