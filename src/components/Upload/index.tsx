import React from "react";

import Dropzone from "react-dropzone";

import { DropContainer, UploadMessage, Container } from "./styles";

interface IProps {
  onUpload: (files: any) => void;
  maxFiles?: number;
  sizeFiles?: number;
  fileName?: string;
  fileType?: any;
  dropzoneMsg?: React.ReactNode;
  disable?: boolean;
}

const Upload: React.FC<IProps> = ({
  onUpload,
  maxFiles,
  sizeFiles,
  fileName,
  fileType,
  dropzoneMsg,
  disable,
}) => {
  const maxSize = (sizeFiles ? sizeFiles : 5) * 1024 * 1024;

  const renderDragMessage = (isDragActive, isDragReject, fileName) => {
    if (!isDragActive) {
      return fileName ? (
        <UploadMessage sizeFiles={sizeFiles}>{fileName}</UploadMessage>
      ) : (
        <UploadMessage sizeFiles={sizeFiles}>
          {dropzoneMsg || "Arraste sua imagem ou procure aqui!"}
        </UploadMessage>
      );
    }

    if (isDragReject || onUpload.length > 1) {
      return (
        <UploadMessage typeof="error">Arquivo não suportado!</UploadMessage>
      );
    }

    return (
      <UploadMessage typeof="success">Adicione a imagem aqui!</UploadMessage>
    );
  };

  return (
    <Container className="containerUpload">
      <Dropzone
        accept={fileType || "image/*"}
        onDropAccepted={onUpload}
        maxFiles={maxFiles ? maxFiles : 1}
        maxSize={maxSize}
      >
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
          <DropContainer
            {...getRootProps()}
            dragActive={isDragActive}
            dragReject={isDragReject}
            sizeFiles={sizeFiles}
            disabled={disable}
          >
            <input {...getInputProps()} disabled={disable} />
            {renderDragMessage(isDragActive, isDragReject, fileName)}
          </DropContainer>
        )}
      </Dropzone>
    </Container>
  );
};

export default Upload;
