"use client";

import { useT } from "@/components/i18n/useT";
import UploadPhoto from "../uploadPhoto/UploadPhoto";
import "./emptyFeed.scss";

interface IProps {
  slug: string;
}

const EmptyFeed = ({ slug }: IProps) => {
  const { t } = useT();

  return (
    <div className="emptyFeed">
      <h2 className="title">{t.feed.emptyTitle}</h2>
      <p className="text">{t.feed.emptyText}</p>
      <UploadPhoto slug={slug} className="addBtn">
        {t.feed.addPhoto}
      </UploadPhoto>
    </div>
  );
};

export default EmptyFeed;
