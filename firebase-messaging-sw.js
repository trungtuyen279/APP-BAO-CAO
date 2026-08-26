/* ==========================================================
   NHẬN THÔNG BÁO ĐẨY KHI APP ĐANG ĐÓNG — LICOGI13FC
   File này BẮT BUỘC nằm ngoài cùng repo (cùng chỗ index.html)
   ========================================================== */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyATbcr8HtYCUciYrMs-5LfHPd334kEdL0g",
  authDomain: "app-bao-cao-bch.firebaseapp.com",
  projectId: "app-bao-cao-bch",
  storageBucket: "app-bao-cao-bch.firebasestorage.app",
  messagingSenderId: "523699300306",
  appId: "1:523699300306:web:2a5d6f951ac5ec002c8a0b"
});

firebase.messaging().onBackgroundMessage(function(payload){
  const d = payload.data || {};
  self.registration.showNotification(d.tieuDe || 'BÁO CÁO CÔNG VIỆC BCH', {
    body: d.noiDung || '',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    vibrate: d.mucDo === 'Khẩn' ? [300,120,300,120,300] : [220,110,220],
    tag: d.id || 'bch',
    requireInteraction: d.mucDo === 'Khẩn',
    data: {url: d.url || './'}
  });
});

self.addEventListener('notificationclick', function(e){
  e.notification.close();
  const dich = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(clients.matchAll({type:'window', includeUncontrolled:true}).then(function(ds){
    for (const c of ds) if ('focus' in c) return c.focus();
    return clients.openWindow(dich);
  }));
});
