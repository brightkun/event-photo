import { useT } from "@/components/i18n/useT";
import UploadPhoto from "@/components/widgets/uploadPhoto/UploadPhoto";

interface IProps {
  slug: string;
}


const HeaderWall = ({ slug }: IProps) => {
  const { t } = useT();

  return (
    <div className="wall">
      <UploadPhoto slug={slug} className="uploadBtn">
        {t.header.uploadPhoto}
      </UploadPhoto>
    </div>
  );
};

export default HeaderWall;
