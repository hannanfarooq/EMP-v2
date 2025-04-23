import { uploadFile } from 'react-s3';
window.Buffer = window.Buffer || require("buffer").Buffer;

const config = {
  bucketName: process.env.REACT_APP_S3_BUCKET,
  region: process.env.REACT_APP_REGION,
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
};

export async function uploadPDFAndGetURL(mediaFile) {
  if (!mediaFile) return null;

  const fileExtension = mediaFile.name.split('.').pop().toLowerCase();
  const fileName = `${new Date().getTime()}_${mediaFile.name}`;

  // Upload the file to S3
  try {
    const data = await uploadFile(mediaFile, {
      ...config,
      key: `uploads/${fileName}`, // Store in the 'uploads' folder
    });

    return data.location; // Return the URL of the uploaded PDF
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return null;
  }
}

// Usage example:
// const mediaUrl = await uploadFileAndGetURL(file);
