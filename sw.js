/* Service worker — cho phép mở app khi không có mạng.
   Đổi CACHE mỗi lần phát hành bản mới để máy anh em tự nạp bản mới. */
const CACHE = 'l13fc-ht-v3.18.1';
const THU_VIEN = 'l13fc-thuvien';   // 3.12.3: thư viện Firebase (đường dẫn có số phiên bản) — giữ lâu dài, không xoá khi đổi bản
const FILES = ['./', './index.html', './config.js', './huong-dan-cai-dat.html', './manifest.webmanifest',
  './icons/logo.png', './icons/logo-login.png', './icons/icon-192.png', './icons/icon-512.png', './icons/bb-header.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CACHE && k !== THU_VIEN).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  /* 3.12.3: thư viện Firebase → lấy trong máy trước (tải 1 lần), không chờ mạng mỗi lần mở app */
  if (url.hostname === 'www.gstatic.com' && url.pathname.indexOf('/firebasejs/') === 0){
    e.respondWith(caches.open(THU_VIEN).then(c => c.match(e.request).then(r => r || fetch(e.request).then(n => {
      if (n.ok || n.type === 'opaque') c.put(e.request, n.clone()); return n; }))));
    return;
  }
  /* 3.12.3: mọi địa chỉ ngoài app (Firestore, Google API, Drive, Apps Script…) đi thẳng mạng, KHÔNG lưu —
     trước đây luồng nghe tin của Firestore bị chép vào bộ nhớ đệm mỗi lần mở, làm chậm và đầy bộ nhớ */
  if (url.origin !== self.location.origin) return;
  if (url.pathname.toLowerCase().endsWith('.pdf')) return;   // PDF nặng: KHÔNG cache, chỉ tải khi bấm mở
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});

/* ================= 3.12.4: NHẬN THÔNG BÁO ĐẨY (gộp từ firebase-messaging-sw.js) =================
   Trước đây app có 2 service worker cùng phạm vi './' (sw.js và firebase-messaging-sw.js). Mỗi lần mở app, sw.js
   đăng ký lại và THAY CHỖ firebase-messaging-sw.js → tin đẩy đến máy không có ai hiện → không rung, không hiện màn khoá.
   Nay chỉ còn MỘT service worker (file này) vừa giữ bộ đệm vừa hiện thông báo. */
let coFB = false;
try {
  importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
                'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
  firebase.initializeApp({apiKey:"AIzaSyATbcr8HtYCUciYrMs-5LfHPd334kEdL0g", authDomain:"app-bao-cao-bch.firebaseapp.com",
    projectId:"app-bao-cao-bch", storageBucket:"app-bao-cao-bch.firebasestorage.app", messagingSenderId:"523699300306",
    appId:"1:523699300306:web:2a5d6f951ac5ec002c8a0b"});
  firebase.messaging().onBackgroundMessage(p => hienTB((p && p.data) || {}));
  coFB = true;
} catch(e){}
function hienTB(d){
  return self.registration.showNotification(d.tieuDe || 'BÁO CÁO CÔNG VIỆC BCH', {
    body: d.noiDung || '', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png',
    vibrate: d.mucDo === 'Khẩn' ? [300, 120, 300, 120, 300] : [220, 110, 220],
    tag: d.id || ('bch' + Date.now()), renotify: true,           // cùng nhóm chat thì gộp 1 dòng nhưng VẪN rung lại
    requireInteraction: d.mucDo === 'Khẩn', timestamp: Date.now(),
    data: {url: d.url || './'}});
}
/* dự phòng khi không tải được thư viện Firebase: tự đọc gói tin đẩy */
if (!coFB) self.addEventListener('push', e => {
  let j = {}; try { j = e.data ? e.data.json() : {}; } catch(x){}
  e.waitUntil(hienTB(j.data || j));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const dich = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(clients.matchAll({type:'window', includeUncontrolled:true}).then(ds => {
    for (const c of ds){ if ('focus' in c){ try { c.postMessage({moTB: dich}); } catch(x){} return c.focus(); } }
    return clients.openWindow(dich);
  }));
});
