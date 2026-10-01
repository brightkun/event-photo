import { useGetEvent } from "@/components/hooks/events/useGetEvent";
import { formatStats } from "@/components/utils/formatStats";
import UploadPhoto from "@/components/widgets/uploadPhoto/UploadPhoto";

interface IProps {
  slug: string;
}


const HeaderWall = ({ slug }: IProps) => {
  const { data: event } = useGetEvent(slug);

  return (
    <div className="wall">
      {event && event.photos_count > 0 && (
        <span className="stats">
          {formatStats(event.photos_count, event.guests_count)}
        </span>
      )}
      <UploadPhoto slug={slug} className="uploadBtn">
        Upload photo
      </UploadPhoto>
    </div>
  );
};

export default HeaderWall;
