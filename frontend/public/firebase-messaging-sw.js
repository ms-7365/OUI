// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken } from "firebase/messaging";
// import { initializeApp } from'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
// import { getMessaging, getToken } from'https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js';

importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC4rZM4zSMnMeEfwTQtwBcLMjRgkAegLqc",
    authDomain: "project-oui.firebaseapp.com",
    projectId: "project-oui",
    storageBucket: "project-oui.appspot.com",
    messagingSenderId: "564919296989",
    appId: "1:564919296989:web:6a19bdce8eda1836af0c34",
    measurementId: "G-QZPB4ZZJVX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

self.addEventListener("push", (event) => {
    const data = event.data.json();
    console.log("Push event data:", data);

    // 'data' 필드 내의 알림 정보를 사용
    const notificationTitle = data.data.title; // 'data.title'로 변경
    const notificationOptions = {
        body: data.data.body, // 'data.body'로 변경
        data: {
            link: data.data.link // 링크 정보를 'data' 필드에서 직접 가져옴
        }
    };

    event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
    );
});

self.addEventListener('notificationclick', event => {
    console.log('[Service Worker] Notification click Received.');
    console.log('Notification data:', event.notification.data);

    event.notification.close(); // 알림 닫기

    // 'data.link'를 사용하여 클릭 시 열릴 URL 결정
    const urlToOpen = event.notification.data.link;

    event.waitUntil(
        clients.openWindow(urlToOpen)
    );
});