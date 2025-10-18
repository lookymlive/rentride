import { Button } from '@mantine/core';
import {
  CldUploadWidget,
  CldUploadWidgetPropsOptions,
  CldUploadWidgetResults,
} from 'next-cloudinary';
import React from 'react';

interface Props {
  onUpload: (
    result: CldUploadWidgetResults,
    widget: any
  ) => Promise<void> | undefined;
  options?: CldUploadWidgetPropsOptions;
}
export const Uploader = ({ onUpload, options }: Props) => {
  const defaultOptions: CldUploadWidgetPropsOptions = {
    sources: ['local'],
    maxFiles: 1,
    multiple: false,
    singleUploadAutoClose: true,
    showPoweredBy: false,
    ...options,
  };

  return (
    <>
      <CldUploadWidget
        uploadPreset="uexvi0k1"
        signatureEndpoint="/api/sign"
        onUpload={(result, widget) => {
          onUpload(result, widget);
        }}
        options={defaultOptions}
      >
        {({ open }) => {
          function handleOnClick(e: any) {
            e.preventDefault();
            open();
          }
          return (
            <Button variant="outline" onClick={handleOnClick}>
              Upload image
            </Button>
          );
        }}
      </CldUploadWidget>
    </>
  );
};
