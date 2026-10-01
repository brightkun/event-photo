import UploadPhoto from "../uploadPhoto/UploadPhoto";
import "./emptyFeed.scss";

interface IProps {
  slug: string;
}

const EmptyFeed = ({ slug }: IProps) => {
  return (
    <div className="emptyFeed">
      <div className="icon">📷</div>
      <h2 className="title">Be the first to add a photo</h2>
      <p className="text">Photos you upload show up here for everyone, live.</p>
      <UploadPhoto slug={slug} className="addBtn">
        Add photo
      </UploadPhoto>
    </div>
  );
};

export default EmptyFeed;
