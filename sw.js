/* Service worker — cho phép mở app khi không có mạng.
   Đổi CACHE mỗi lần phát hành bản mới để máy anh em tự nạp bản mới. */
const CACHE = 'l13fc-ht-v3.12.3';
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
