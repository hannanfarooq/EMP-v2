import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "src/utils/firebase";

export async function uploadPDFAndGetURL(mediaFile) {
  if (!mediaFile) return null;

  // Determine the file type (either image or PDF)
  const fileExtension = mediaFile.name.split('.').pop().toLowerCase();
  const fileType = fileExtension === 'pdf' ? 'pdfs' : 'media'; // Use 'pdfs' directory for PDFs and 'media' for images

  const storageRef = ref(storage, `${fileType}/${new Date().getTime()}_${mediaFile.name}`);
  const uploadTask = uploadBytesResumable(storageRef, mediaFile);

  try {
    await uploadTask;

    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading media file:", error);
    return null;
  }
}

// Usage example:
// const mediaUrl = await uploadMediaAndGetURL(file);
