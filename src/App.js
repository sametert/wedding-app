import React, { useState, useRef, useEffect } from 'react';
import './App.css';
// import image from '/Users/samederturk/Desktop/wedding-app/wedding-photo-app/src/seyfullahbahar.jpeg'

function App() {
  const [photos, setPhotos] = useState([]);
  const [desc, setDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({ desc: '', previewUrl: '', file: null });
  const [userName, setUserName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  const [modalPhoto, setModalPhoto] = useState(null);

  // Kullanıcı ismini localStorage'dan al veya modal aç
  useEffect(() => {
    const stored = localStorage.getItem('wedding-user-name');
    if (stored) {
      setUserName(stored);
      setShowNameModal(false);
    } else {
      setShowNameModal(true);
    }
  }, []);

  // İsim modalı submit
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setUserName(nameInput.trim());
    localStorage.setItem('wedding-user-name', nameInput.trim());
    setShowNameModal(false);
    setNameInput('');
  };

  const handleLogout = () => {
    localStorage.removeItem('wedding-user-name');
    setUserName('');
    setShowNameModal(true);
    setNameInput('');
  };

  // Fotoğraf seçildiğinde önizleme ve dosya state'ini ayarla
  const handlePhotoSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  // Dosya seçici butonuna tıklama
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Sayfa açıldığında localStorage'dan fotoğrafları yükle
  useEffect(() => {
    const storedPhotos = localStorage.getItem('wedding-photos');
    if (storedPhotos) {
      setPhotos(JSON.parse(storedPhotos));
    }
  }, []);

  // photos değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('wedding-photos', JSON.stringify(photos));
  }, [photos]);

  // Anı ekle
  const handleAddMemory = (e) => {
    e.preventDefault();
    if (!desc.trim() || !selectedFile || !previewUrl) return;
    setPhotos(prev => [
      {
        id: Date.now() + Math.random(),
        dataUrl: previewUrl,
        name: userName,
        desc: desc.trim(),
        timestamp: new Date().toLocaleString('tr-TR')
      },
      ...prev
    ]);
    setDesc('');
    setSelectedFile(null);
    setPreviewUrl('');
  };

  // Edit modunu aç
  const startEdit = (photo) => {
    setEditingId(photo.id);
    setEditFields({
      desc: photo.desc,
      previewUrl: photo.dataUrl,
      file: null
    });
  };

  // Edit input değişikliği
  const handleEditChange = (value) => {
    setEditFields(prev => ({ ...prev, desc: value }));
  };

  // Edit fotoğraf seçimi
  const handleEditPhotoSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setEditFields(prev => ({ ...prev, file }));
    const reader = new FileReader();
    reader.onload = (e) => {
      setEditFields(prev => ({ ...prev, previewUrl: e.target.result }));
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  // Edit dosya seçici
  const openEditFileDialog = () => {
    if (editFileInputRef.current) {
      editFileInputRef.current.value = '';
      editFileInputRef.current.click();
    }
  };

  // Edit kaydet
  const handleEditSave = (id) => {
    setPhotos(prev => prev.map(photo =>
      photo.id === id
        ? {
            ...photo,
            desc: editFields.desc,
            dataUrl: editFields.previewUrl
          }
        : photo
    ));
    setEditingId(null);
    setEditFields({ desc: '', previewUrl: '', file: null });
  };

  // Edit iptal
  const handleEditCancel = () => {
    setEditingId(null);
    setEditFields({ desc: '', previewUrl: '', file: null });
  };

  const deletePhoto = (photoId) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex flex-col">
      {/* Sağ üstte sabit çıkış butonu */}
      {userName && !showNameModal && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-white/80 text-pink-600 text-xs font-semibold hover:bg-pink-100 border border-pink-200 shadow transition-all"
          >
            Çıkış Yap / İsmini Değiştir
          </button>
        </div>
      )}
      {/* Gelin & Damat Fotoğrafı ve İsimleri */}
      <div className="flex flex-col items-center justify-center mt-6 mb-8 px-2">
        <div className="bg-white/80 rounded-3xl shadow-xl p-4 flex flex-col items-center w-full max-w-md">
          <img
            src="/seyfullahbahar.jpeg"
            alt="Seyfullah & Bahar"
            className="w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-full border-4 border-pink-400 shadow-lg mb-3"
            style={{ objectPosition: 'center top' }}
          />
          <h2 className="text-2xl sm:text-3xl font-bold text-pink-700 tracking-wide mb-1 text-center">SEYFULLAH & BAHAR</h2>
          <div className="text-pink-400 font-semibold text-lg mb-1 text-center">Düğün Hatırası</div>
        </div>
      </div>
      {/* İsim Modalı */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleNameSubmit} className="bg-white rounded-lg shadow-lg p-8 max-w-xs w-full">
            <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">Hoş geldiniz!</h2>
            <label className="block text-gray-700 font-semibold mb-2 text-center">Lütfen adınızı ve soyadınızı girin:</label>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 mb-4"
              placeholder="İsim Soyisim"
              maxLength={50}
              required
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-2 rounded-full font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Devam Et
            </button>
          </form>
        </div>
      )}
      <div className="container mx-auto px-2 sm:px-4 py-4 flex-1 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">💒 Düğün Anı Galerisi</h1>
          <p className="text-gray-600 text-base sm:text-lg">Anınızı ve fotoğrafınızı paylaşın!</p>
          {userName && <p className="text-pink-600 mt-2 font-semibold text-base sm:text-lg">👤 {userName}</p>}
        </div>

        {/* Anı Ekle Formu */}
        <form onSubmit={handleAddMemory} className="max-w-lg mx-auto bg-white/90 rounded-2xl shadow-2xl p-6 mb-10 backdrop-blur-md">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Anı Açıklaması</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Kısa bir anı veya mesaj yazın"
              rows={3}
              maxLength={200}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Fotoğraf</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={openFileDialog}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:shadow-lg transition-all duration-200"
            >
              📤 Fotoğraf Seç
            </button>
            {previewUrl && (
              <div className="mt-4 flex justify-center">
                <img src={previewUrl} alt="Önizleme" className="h-32 rounded-lg shadow border object-cover" />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!desc.trim() || !selectedFile || !previewUrl}
            className={`w-full py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-200 mt-2 ${
              (!desc.trim() || !selectedFile || !previewUrl)
                ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-xl hover:scale-105'
            }`}
          >
            ➕ Anıyı Ekle
          </button>
        </form>

        {/* Photo Gallery */}
        <div className="mb-8">
          {photos.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                📸 Paylaşılan Anılar ({photos.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group cursor-pointer" onClick={() => editingId ? null : setModalPhoto(photo)}>
                    <div className="bg-white/90 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full border border-pink-100 hover:scale-[1.025] hover:shadow-2xl transition-transform duration-200">
                      {editingId === photo.id ? (
                        <>
                          <textarea
                            value={editFields.desc}
                            onChange={e => handleEditChange(e.target.value)}
                            className="w-full px-3 py-2 border-b border-pink-200 text-gray-700 text-sm mb-2 focus:outline-none"
                            rows={2}
                            maxLength={200}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            ref={editFileInputRef}
                            onChange={handleEditPhotoSelect}
                            className="hidden"
                          />
                          <div className="flex justify-center mb-2">
                            <img src={editFields.previewUrl} alt="Edit Önizleme" className="h-28 rounded shadow border object-cover" />
                          </div>
                          <div className="flex justify-center gap-2 mb-2">
                            <button
                              type="button"
                              onClick={openEditFileDialog}
                              className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow hover:shadow-lg"
                            >
                              📤 Fotoğrafı Değiştir
                            </button>
                          </div>
                          <div className="flex justify-center gap-2 mb-3">
                            <button
                              type="button"
                              onClick={() => handleEditSave(photo.id)}
                              disabled={!editFields.desc.trim() || !editFields.previewUrl}
                              className={`px-4 py-1 rounded-full font-semibold text-sm shadow transition-all duration-200 ${
                                (!editFields.desc.trim() || !editFields.previewUrl)
                                  ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                                  : 'bg-green-500 text-white hover:bg-green-600'
                              }`}
                            >
                              Kaydet
                            </button>
                            <button
                              type="button"
                              onClick={handleEditCancel}
                              className="px-4 py-1 rounded-full font-semibold text-sm shadow bg-gray-300 text-gray-600 hover:bg-gray-400"
                            >
                              Vazgeç
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={photo.dataUrl}
                            alt={photo.name || 'Yüklenen fotoğraf'}
                            className="w-full aspect-[3/4] object-cover"
                          />
                          <div className="p-4 flex-1 flex flex-col">
                            <p className="font-bold text-pink-600 text-lg mb-1">{photo.name}</p>
                            <p className="text-gray-700 text-sm mb-2 flex-1">{photo.desc}</p>
                            <p className="text-xs text-gray-400 mt-auto">{photo.timestamp}</p>
                          </div>
                        </>
                      )}
                      {/* Sadece kendi anısında düzenle ve sil butonu */}
                      {userName && userName === photo.name && editingId !== photo.id && (
                        <>
                          <button
                            onClick={e => { e.stopPropagation(); startEdit(photo); }}
                            className="absolute top-2 left-2 bg-yellow-400 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-500"
                            title="Düzenle"
                          >
                            ✎
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); deletePhoto(photo.id); }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            title="Sil"
                          >
                            ×
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Henüz anı eklenmedi
              </h3>
              <p className="text-gray-500">
                Anınızı ve fotoğrafınızı eklemek için yukarıdaki formu doldurun!
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Modal: Fotoğraf Detay */}
      {modalPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setModalPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-4 max-w-xs w-full sm:max-w-md relative flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-pink-500 font-bold focus:outline-none"
              onClick={() => setModalPhoto(null)}
              aria-label="Kapat"
            >
              ×
            </button>
            <img
              src={modalPhoto.dataUrl}
              alt={modalPhoto.name}
              className="w-full max-h-80 object-contain rounded-xl mb-4 border shadow"
            />
            <div className="text-pink-600 font-bold text-lg mb-1 text-center">{modalPhoto.name}</div>
            <div className="text-gray-700 text-base mb-2 text-center">{modalPhoto.desc}</div>
            <div className="text-xs text-gray-400 text-center">{modalPhoto.timestamp}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
