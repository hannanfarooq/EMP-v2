// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { storage } from "src/utils/firebase";

// export async function uploadImageAndGetURL(image) {
//   if (!image) return null;

//   const storageRef = ref(storage, "media/" + new Date().getTime() + image.name);
//   const uploadTask = uploadBytesResumable(storageRef, image);

//   try {
//     await uploadTask;

//     const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//     return downloadURL;
//   } catch (error) {
//     // Handle any errors during the upload and URL retrieval
//     console.error("Error uploading image:", error);
//     return null;
//   }
// }

// // Usage example:
// // const imageUrl = await uploadImageAndGetURL(imageFile);
import { uploadFile } from 'react-s3';
window.Buffer = window.Buffer || require("buffer").Buffer;

const config = {
  bucketName: process.env.REACT_APP_S3_BUCKET,
  region: process.env.REACT_APP_REGION,
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
};

export async function uploadImageAndGetURL(mediaFile) {
  if (!mediaFile) return null;

  const fileExtension = mediaFile.name.split('.').pop();
  const fileName = `${new Date().getTime()}_${mediaFile.name}`;

  // Upload the file to S3
  try {
    const data = await uploadFile(mediaFile, {
      ...config,
      key: `media/${fileName}`, // Store in the 'media' folder
    });

    return data.location; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading media file to S3:", error);
    return null;
  }
}


// Usage example:
// const imageUrl = await uploadImageAndGetURL(imageFile);

