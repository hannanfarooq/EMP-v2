import { storage } from "src/utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
export async function uploadPDFAndGetURL(mediaFile) {
  if (!mediaFile) return null;

  // Extract the file extension and type dynamically
  const fileExtension = mediaFile.name ? mediaFile.name.split('.').pop().toLowerCase():mediaFile.split('.').pop().toLowerCase();

  // Use a directory named 'uploads' for all file types
  const storageRef = ref(storage, `uploads/${new Date().getTime()}_${mediaFile.name}`);
  const uploadTask = uploadBytesResumable(storageRef, mediaFile);

  try {
    await uploadTask;

    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}
// Usage example:
// const mediaUrl = await uploadFileAndGetURL(file);
