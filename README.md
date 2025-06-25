<<<<<<< HEAD
# 💒 Düğün Fotoğraf Galerisi

Modern ve kullanıcı dostu bir düğün fotoğraf paylaşım uygulaması. Misafirler anılarını ve fotoğraflarını kolayca paylaşabilir.

## 🚀 Özellikler

- **📱 Mobil Uyumlu**: Telefon ve tablet cihazlarda mükemmel çalışır
- **🔥 Firebase Entegrasyonu**: Bulut tabanlı veri depolama
- **📸 Fotoğraf Yükleme**: Yüksek kaliteli fotoğraf depolama
- **👥 Kullanıcı Yönetimi**: İsim tabanlı anı paylaşımı
- **🔒 Admin Paneli**: Tüm anıları yönetme yetkisi
- **✏️ Düzenleme**: Anıları düzenleme ve silme
- **💾 Offline Destek**: İnternet bağlantısı kesilse bile yerel depolama

## 🛠️ Kurulum

### 1. Projeyi İndirin
```bash
git clone [your-repo-url]
cd wedding-app-main
```

### 2. Bağımlılıkları Kurun
```bash
npm install
```

### 3. Firebase Konfigürasyonu

#### Firebase Console'da Proje Oluşturma:
1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. "Proje Ekle" butonuna tıklayın
3. Proje adını girin (örn: "dugumun-adi-wedding")
4. Google Analytics'i etkinleştirin (isteğe bağlı)
5. Projeyi oluşturun

#### Web Uygulaması Ekleme:
1. Firebase Console'da projenizi açın
2. "Web" ikonuna (<>) tıklayın
3. Uygulama adını girin
4. Firebase Hosting'i etkinleştirin (isteğe bağlı)
5. Konfigürasyon bilgilerini kopyalayın

#### Firestore Database Kurulumu:
1. Sol menüden "Firestore Database" seçin
2. "Veritabanı oluştur" butonuna tıklayın
3. **Test modunda başla** seçeneğini seçin (şimdilik)
4. Konum seçin (Europe-west2 önerilen)

#### Firebase Storage Kurulumu:
1. Sol menüden "Storage" seçin
2. "Başla" butonuna tıklayın
3. **Test modunda başla** seçeneğini seçin
4. Konum seçin (Firestore ile aynı)

#### Konfigürasyon Dosyasını Güncelleme:
`src/firebase.js` dosyasındaki konfigürasyon bilgilerini Firebase Console'dan aldığınız bilgilerle değiştirin:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

### 4. Güvenlik Kuralları (Önemli!)

#### Firestore Kuralları:
Firebase Console > Firestore Database > Rules sekmesinde:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /photos/{document} {
      allow read, write: if true;
    }
  }
}
```

#### Storage Kuralları:
Firebase Console > Storage > Rules sekmesinde:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## 🚀 Uygulamayı Başlatma

```bash
npm start
```

Uygulama http://localhost:3000 adresinde açılacak.

## 📱 Kullanım

### Kullanıcılar İçin:
1. İlk açılışta isminizi girin
2. Anı açıklaması yazın
3. Fotoğraf seçin
4. "Anıyı Ekle" butonuna tıklayın
5. Paylaşılan anıları görüntüleyin

### Admin İçin:
1. Sağ üst köşedeki "Admin Modu" butonuna tıklayın
2. Pin kodu girin: `1438`
3. Tüm anıları düzenleyebilir ve silebilirsiniz

## 🔧 Özelleştirme

### Admin Pin Kodunu Değiştirme:
`src/App.js` dosyasında `ADMIN_PIN` değişkenini değiştirin:
```javascript
const ADMIN_PIN = 'yeni-pin-kodunuz';
```

### Renk Temasını Değiştirme:
`tailwind.config.js` dosyasında özel renkler ekleyebilirsiniz.

### Çift İsimlerini Değiştirme:
1. `src/App.js` dosyasında "SEYFULLAH & BAHAR" metnini değiştirin
2. `public/seyfullahbahar.jpeg` dosyasını kendi fotoğrafınızla değiştirin

## 🚢 Production'a Deployment

### Vercel ile Deploy:
1. [Vercel](https://vercel.com) hesabı oluşturun
2. Projeyi GitHub'a yükleyin
3. Vercel'de "New Project" > GitHub reposu seçin
4. Deploy edin

### Netlify ile Deploy:
1. [Netlify](https://netlify.com) hesabı oluşturun
2. "New site from Git" seçin
3. GitHub reposu bağlayın
4. Build command: `npm run build`
5. Publish directory: `build`

### Firebase Hosting ile Deploy:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 🔒 Güvenlik Notları

- **Üretim ortamında** Firestore ve Storage kurallarını daha katı hale getirin
- API anahtarlarını environment variables olarak saklayın
- HTTPS kullanmayı unutmayın

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Firebase Console'da hata loglarını kontrol edin
2. Browser Developer Tools > Console'da hataları kontrol edin
3. İnternet bağlantınızı kontrol edin

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> 076fc3ff38ea5082ef0a5e7394b3b90f6631336c
