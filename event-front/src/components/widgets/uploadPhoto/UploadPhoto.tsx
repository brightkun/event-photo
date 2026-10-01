"use client";

import { usePostPhoto } from "@/components/hooks/photos/usePostPhoto";
import { useGuestStore } from "@/components/store/useGuestStore";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";

interface IProps {
  slug: string;
  className: string;
  children: string;
  busyLabel?: string;
  failedLabel?: string;
}

const UploadPhoto = ({
  slug,
  className,
  children,
  busyLabel = "Uploading...",
  failedLabel = "Upload failed",
}: IProps) => {
  const { push } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const guest = useGuestStore((state) => state.guests[slug]);
  const { mutate, isPending } = usePostPhoto();
  const [failed, setFailed] = useState(false);

  const onClick = () => {
    if (!guest) {
      push(`/join/${slug}`);
      return;
    }

    inputRef.current?.click();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file || !guest) return;

    mutate(
      { slug, token: guest.token, file },
      {
        onError: () => {
          setFailed(true);
          setTimeout(() => setFailed(false), 3000);
        },
      },
    );
  };

  return (
    <>
      <button className={className} onClick={onClick} disabled={isPending}>
        {isPending ? busyLabel : failed ? failedLabel : children}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={onChange}
      />
    </>
  );
};

export default UploadPhoto;
