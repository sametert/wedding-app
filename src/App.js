import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Component unmount olduğunda kamerayı kapat
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const openCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError('');
      setIsVideoReady(false);
      
      console.log('Kamera açılıyor...');
      
      // MacBook için daha basit kamera ayarları
      const constraints = {
        video: {
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          frameRate: { ideal: 30, max: 60 }
        }
      };
      
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Kamera başarıyla açıldı');
      } catch (error) {
        console.error('Kamera açılamadı:', error);
        throw error;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOpen(true);
        
        // Video'nun hazır olmasını bekle
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata yüklendi');
          console.log('Video boyutları:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
          setIsVideoReady(true);
          setIsLoading(false);
        };

        videoRef.current.onerror = (error) => {
          console.error('Video hatası:', error);
          setCameraError('Video yüklenirken hata oluştu.');
          setIsLoading(false);
        };

        // Video'nun gerçekten oynatılmaya başladığını kontrol et
        videoRef.current.oncanplay = () => {
          console.log('Video oynatılmaya hazır');
          setIsVideoReady(true);
          setIsLoading(false);
        };
      }
    } catch (error) {
      console.error('Kamera açılamadı:', error);
      setCameraError(`Kamera erişimi sağlanamadı: ${error.message}. Lütfen kamera izinlerini kontrol edin.`);
      setIsLoading(false);
    }
  };

  const closeCamera = () => {
    console.log('Kamera kapatılıyor...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Track durduruldu:', track.kind);
      });
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraError('');
    setIsVideoReady(false);
    setIsLoading(false);
  };

  const takePhoto = () => {
    console.log('=== FOTOĞRAF ÇEKME BAŞLADI ===');
    console.log('Video hazır mı?', isVideoReady);
    console.log('Video ref var mı?', !!videoRef.current);
    console.log('Canvas ref var mı?', !!canvasRef.current);
    
    if (!videoRef.current || !canvasRef.current) {
      alert('Kamera bileşenleri bulunamadı. Lütfen sayfayı yenileyin.');
      return;
    }

    if (!isVideoReady) {
      alert('Kamera henüz hazır değil. Lütfen birkaç saniye bekleyin ve tekrar deneyin.');
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      console.log('Video boyutları:', video.videoWidth, 'x', video.videoHeight);
      console.log('Video durumu:', video.readyState);

      // Video'nun gerçekten hazır olduğunu kontrol et
      if (video.readyState < 2) {
        alert('Video henüz tam olarak yüklenmedi. Lütfen bekleyin.');
        return;
      }

      // Canvas boyutlarını video boyutlarına ayarla
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      console.log('Canvas boyutları ayarlandı:', canvas.width, 'x', canvas.height);

      // Video frame'ini canvas'a çiz
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      console.log('Video frame canvas\'a çizildi');

      // Canvas'tan data URL al
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Data URL oluşturuldu, uzunluk:', photoDataUrl.length);

      if (photoDataUrl.length < 100) {
        alert('Fotoğraf çekilemedi. Lütfen tekrar deneyin.');
        return;
      }

      // Yeni fotoğrafı listeye ekle
      const newPhoto = {
        id: Date.now(),
        dataUrl: photoDataUrl,
        timestamp: new Date().toLocaleString('tr-TR')
      };

      console.log('Yeni fotoğraf objesi oluşturuldu:', newPhoto.id);

      setPhotos(prevPhotos => {
        const newPhotos = [newPhoto, ...prevPhotos];
        console.log('Fotoğraf galeriye eklendi. Toplam fotoğraf sayısı:', newPhotos.length);
        return newPhotos;
      });
      
      console.log('=== FOTOĞRAF BAŞARIYLA ÇEKİLDİ ===');
      
    } catch (error) {
      console.error('Fotoğraf çekme hatası:', error);
      alert(`Fotoğraf çekilirken hata oluştu: ${error.message}`);
    }
  };

  // Test fotoğrafı oluştur (MacBook test için)
  const createTestPhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const context = canvas.getContext('2d');
    
    // Test görüntüsü oluştur
    context.fillStyle = '#f0f0f0';
    context.fillRect(0, 0, 640, 480);
    context.fillStyle = '#333';
    context.font = '48px Arial';
    context.textAlign = 'center';
    context.fillText('Test Fotoğrafı', 320, 240);
    context.font = '24px Arial';
    context.fillText('MacBook Test', 320, 280);
    
    const testPhotoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    const newPhoto = {
      id: Date.now(),
      dataUrl: testPhotoDataUrl,
      timestamp: new Date().toLocaleString('tr-TR') + ' (Test)'
    };

    setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);
    console.log('Test fotoğrafı eklendi');
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
          <p className="text-gray-600">Anınızı yakalayın ve paylaşın!</p>
        </div>

        {/* Camera Section */}
        {!isCameraOpen ? (
          <div className="text-center mb-8 space-y-4">
            <button
              onClick={openCamera}
              disabled={isLoading}
              className={`px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all duration-200 ${
                isLoading 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isLoading ? '⏳ Kamera Açılıyor...' : '📸 Fotoğraf Çek'}
            </button>
            
            {/* Test Butonu (MacBook için) */}
            <div>
              <button
                onClick={createTestPhoto}
                className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm hover:bg-blue-600 transition-colors"
              >
                🧪 Test Fotoğrafı Oluştur
              </button>
              <p className="text-xs text-gray-600 mt-1">MacBook test için</p>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            {/* Kamera Preview - Sağ Üstte */}
            <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-xl p-4 max-w-xs">
              <div className="text-center mb-2">
                <h3 className="text-sm font-semibold text-gray-800">📹 Kamera Önizleme</h3>
              </div>
              
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
              />
              
              <div className="flex justify-center space-x-2 mt-3">
                <button
                  onClick={takePhoto}
                  disabled={!isVideoReady}
                  className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-colors ${
                    isVideoReady 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  📷 Çek
                </button>
                <button
                  onClick={closeCamera}
                  className="bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 transition-colors font-semibold shadow-lg"
                >
                  ❌ Kapat
                </button>
              </div>
              
              {/* Kamera Durumu */}
              {!isVideoReady && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <p className="text-yellow-800 text-center">
                    🔄 Yükleniyor...
                  </p>
                </div>
              )}
              
              {/* Kamera Hatası */}
              {cameraError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                  <p className="text-red-800">{cameraError}</p>
                </div>
              )}
            </div>
            
            {/* Ana İçerik */}
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                <div className="text-center mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    📱 Sağ üstteki kamera önizlemesini kullanın!
                  </p>
                </div>
                
                <div className="text-gray-600">
                  <p className="mb-2">• Kamera sağ üstte açıldı</p>
                  <p className="mb-2">• "Çek" butonuna basın</p>
                  <p>• Fotoğraf otomatik galeriye eklenecek</p>
                </div>
              </div>
            </div>
            
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              📸 Çekilen Fotoğraflar ({photos.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img
                      src={photo.dataUrl}
                      alt="Çekilen fotoğraf"
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
          </div>
        )}

        {/* Empty State */}
        {photos.length === 0 && !isCameraOpen && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Henüz fotoğraf çekilmedi
            </h3>
            <p className="text-gray-500">
              İlk fotoğrafınızı çekmek için yukarıdaki butona tıklayın!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
