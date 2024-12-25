import React, { useState } from 'react';
import { uploadFile } from 'react-s3';
window.Buffer = window.Buffer || require("buffer").Buffer;

const config = {
  bucketName: process.env.REACT_APP_S3_BUCKET,
  region: process.env.REACT_APP_REGION,
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
}

export async function uploadFileToS3(file) {
  if (!file) return null;

  const lowercaseFilename = file.name.toLowerCase();

  if (lowercaseFilename.endsWith('.docx') || lowercaseFilename.endsWith('.pdf')) {

    try {
      const downloadURL = await uploadFile(file, config)
        .then(data => data?.location)
        .catch(err => console.error(err))

      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  } else {
    console.error("Invalid file selected");
    return null
  }
}