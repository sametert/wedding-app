// Firebase konfigürasyonu ve servisler
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy, 
  query,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

// Firebase konfigürasyonu
const firebaseConfig = {
  apiKey: "AIzaSyC8PxjwxzUqPnp1PDFyhJD6S0892mwg4mI",
  authDomain: "wedding-photo-app-5e673.firebaseapp.com",
  projectId: "wedding-photo-app-5e673",
  storageBucket: "wedding-photo-app-5e673.firebasestorage.app",
  messagingSenderId: "767705981953",
  appId: "1:767705981953:web:7ea6c09ddc858bed3a4c00",
  measurementId: "G-EBQ8Q8R8MQ"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Analytics'i başlat
export const analytics = getAnalytics(app);

// Firestore (veritabanı) servisi
export const db = getFirestore(app);

// Storage (dosya depolama) servisi
export const storage = getStorage(app);

// Veritabanı koleksiyonları
export const COLLECTIONS = {
  PHOTOS: 'photos'
};

// Fotoğraf yükleme fonksiyonu
export const uploadPhoto = async (file, fileName) => {
  try {
    const storageRef = ref(storage, `photos/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Fotoğraf yükleme hatası:', error);
    throw error;
  }
};

// Fotoğraf silme fonksiyonu
export const deletePhoto = async (photoUrl) => {
  try {
    const photoRef = ref(storage, photoUrl);
    await deleteObject(photoRef);
  } catch (error) {
    console.error('Fotoğraf silme hatası:', error);
    throw error;
  }
};

// Anı ekleme fonksiyonu
export const addMemory = async (memoryData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PHOTOS), {
      ...memoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Anı ekleme hatası:', error);
    throw error;
  }
};

// Anıları getirme fonksiyonu
export const getMemories = async () => {
  try {
    const q = query(
      collection(db, COLLECTIONS.PHOTOS), 
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const memories = [];
    querySnapshot.forEach((doc) => {
      memories.push({ id: doc.id, ...doc.data() });
    });
    return memories;
  } catch (error) {
    console.error('Anıları getirme hatası:', error);
    throw error;
  }
};

// Anı güncelleme fonksiyonu
export const updateMemory = async (memoryId, updateData) => {
  try {
    const memoryRef = doc(db, COLLECTIONS.PHOTOS, memoryId);
    await updateDoc(memoryRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Anı güncelleme hatası:', error);
    throw error;
  }
};

// Anı silme fonksiyonu
export const deleteMemory = async (memoryId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PHOTOS, memoryId));
  } catch (error) {
    console.error('Anı silme hatası:', error);
    throw error;
  }
};

export default app; 
