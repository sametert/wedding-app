import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);

  // Fotoğraf yükleme işlemi
  const handlePhotoUpload = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => [
          {
            id: Date.now() + Math.random(),
            dataUrl: e.target.result,
            name: file.name,
            timestamp: new Date().toLocaleString('tr-TR')
          },
          ...prev
        ]);
      };
      reader.readAsDataURL(file);
    }
    // input'u resetle
    event.target.value = '';
  };

  // Dosya seçici butonuna tıklama
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const deletePhoto = (photoId) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">💒 Düğün Fotoğraf Galerisi</h1>
          <p className="text-gray-600">Bilgisayarınızdan veya telefonunuzdan fotoğraf yükleyin ve paylaşın!</p>
        </div>

        {/* Fotoğraf Yükle Butonu */}
        <div className="text-center mb-8">
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <button
            onClick={openFileDialog}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            📤 Fotoğraf Yükle
          </button>
          <p className="text-sm text-gray-500 mt-2">Birden fazla fotoğraf seçebilirsiniz.</p>
        </div>

        {/* Photo Gallery */}
        <div className="mb-8">
          {photos.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                📸 Yüklenen Fotoğraflar ({photos.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <img
                        src={photo.dataUrl}
                        alt={photo.name || 'Yüklenen fotoğraf'}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3">
                        <p className="text-sm text-gray-600">{photo.timestamp}</p>
                      </div>
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Henüz fotoğraf yüklenmedi
              </h3>
              <p className="text-gray-500">
                Bilgisayarınızdan veya telefonunuzdan fotoğraf yüklemek için yukarıdaki butona tıklayın!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
