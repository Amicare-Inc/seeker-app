import { FIREBASE_STORAGE } from '@/firebase.config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

/**
 * Open image picker, select an image, and upload to Firebase Storage.
 * @param userId The user’s unique ID to organize photos by user.
 * @returns The download URL of the uploaded image.
 */
export async function uploadProfilePhoto(userId: string): Promise<string | null> {
  // Request permission and open the image picker
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access camera roll is required!');
    return null;
  }

  // Open image picker to select an image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });
  console.log("RESULT: ",result)
  if (result.canceled) return null;

  const { uri } = result.assets[0]; // Extract URI of the chosen image

  // Upload to Firebase Storage
  const response = await fetch(uri);
  console.log("RESPONSE: ", response)
  const blob = await response.blob();
  console.log("BLOB: ", blob)
  const fileName = `profilePhotos/${userId}_${Date.now()}.jpg`;
  console.log("FILENAME: ", fileName)
  const storageRef = ref(FIREBASE_STORAGE, fileName);
  console.log("STORAGEREF: ", storageRef)
//   await uploadBytes(storageRef, blob);
//   console.log("File uploaded successfully");
try {
    await uploadBytes(storageRef, blob);
    console.log("File uploaded successfully");
    const downloadURL = await getDownloadURL(storageRef);
    console.log("Download URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }

  // Get and return the download URL
//   const downloadURL = await getDownloadURL(storageRef);
//   console.log("DOWNLOADURL: ", downloadURL)
//   return downloadURL;
}