import { Avatar, Flex } from '@mantine/core';
import { CldUploadWidgetResults } from 'next-cloudinary';
import { FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Uploader } from './Uploader';

interface Props {
  updateProfile: (url: string) => Promise<void>;
  profileUrl?: string;
}
export const ProfilePhoto = ({ updateProfile, profileUrl }: Props) => {
  const handleUpload = async (result: CldUploadWidgetResults, widget: any) => {
    const info: any = result?.info;
    await updateProfile(info.secure_url);
    widget.close();
    toast.success('Profile photo updated');
  };

  return (
    <Flex direction="column" gap="sm" justify="flex-start" align="center">
      <Avatar
        src={profileUrl}
        size="140px"
        style={{ borderRadius: '100px', overflow: 'hidden' }}
        radius="xl"
      >
        <FaUser />
      </Avatar>
      <Uploader
        onUpload={handleUpload}
        options={{
          cropping: true,
          showSkipCropButton: false,
          croppingAspectRatio: 1,
          maxFileSize: 2000000, //2MB
        }}
      />
    </Flex>
  );
};
