import UploadPhoto from "@/components/widgets/uploadPhoto/UploadPhoto";

interface IProps {
  slug: string;
}


const HeaderWall = ({ slug }: IProps) => {
  return (
    <div className="wall">
      <UploadPhoto slug={slug} className="uploadBtn">
        Upload photo
      </UploadPhoto>
    </div>
  );
};

export default HeaderWall;
