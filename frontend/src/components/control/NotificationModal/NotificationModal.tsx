import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useStore from 'src/store/index';
// import './NotificationModal.css';
import { initializeApp } from 'firebase/app';
import { postDeviceToken } from './api';
import { getMessaging, getToken } from 'firebase/messaging';

const NotificationModal = ({ isOpen, onClose, onNotificationSelect }) => {
    
    // const user = useSelector(state => state.user.user);
    const { accessToken, isLogin } = useStore()
    //요기바꿈
    // const { accessToken, isLogin } = useStore(state => ({ accessToken: state.accessToken, isLogin: state.isLogin }));

    
    const [notificationPermission, setNotificationPermission] = useState(null);
    // Notification 지원 여부를 추적하는 상태를 추가합니다.
    const [notificationSupported, setNotificationSupported] = useState(false);

    useEffect(() => {
        // 페이지 로드 시 알림 권한 상태와 Notification 지원 여부를 확인합니다.
        checkNotificationPermission();
    }, []);

    useEffect(() => {
        // 사용자가 로그인 상태가 바뀔 때마다 모달을 열거나 푸시 토큰을 서버로 보냅니다.
        if ( isLogin && accessToken && notificationPermission === 'granted' && notificationSupported) {
            // 모달을 열지 않고 바로 푸시 토큰을 서버로 보냅니다.
            initializeFirebase();
        }
    }, [ accessToken, isLogin, notificationPermission, notificationSupported]);

    const checkNotificationPermission = () => {
        if ('Notification' in window) {
            setNotificationSupported(true); // Notification 객체가 존재하면 지원한다고 표시
            if (Notification.permission === 'default') {
                setNotificationPermission(null); // 권한 요청 전
            } else {
                setNotificationPermission(Notification.permission); // 권한 요청 후
            }
        } else {
            console.log('This browser does not support desktop notification');
            setNotificationSupported(false); // Notification 객체가 없으면 지원하지 않는다고 표시
        }
    };

    const handleNotificationSelect = value => {
        onNotificationSelect(value);
        if (value && notificationSupported) {
            initializeFirebase();
        }
        onClose(); // 모달을 닫습니다.
    };

    const initializeFirebase = () => {
        const firebaseConfig = {
            // Firebase 설정 값
            apiKey: "AIzaSyC4rZM4zSMnMeEfwTQtwBcLMjRgkAegLqc",
            authDomain: "project-oui.firebaseapp.com",
            projectId: "project-oui",
            storageBucket: "project-oui.appspot.com",
            messagingSenderId: "564919296989",
            appId: "1:564919296989:web:6a19bdce8eda1836af0c34",
            measurementId: "G-QZPB4ZZJVX"
        };
        initializeApp(firebaseConfig);

        const messaging = getMessaging();

        if (notificationPermission !== 'granted') {
            requestNotificationPermission(messaging);
        } else {
            // 이미 허용된 상태라면 바로 토큰 발급
            sendTokenToServer(messaging);
        }
    };

    const requestNotificationPermission = ( messaging ) => {
        // 사용자에게 알림 권한 요청
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                setNotificationPermission(permission);
                sendTokenToServer(messaging);
            } else if (permission === 'denied') {
                console.log('Notification permission denied.');
                setNotificationPermission(permission);
            }
        });
    };

    const sendTokenToServer = (messaging) => {
        getToken(messaging)
            .then((currentToken) => {
                console.log("device_token: " + currentToken);
                sendTokenToServerBackend(currentToken);
            }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
    };

    const sendTokenToServerBackend = (currentToken) => {
            postDeviceToken(currentToken)
            .then(response => {
                if (!response.data) {
                    throw new Error('서버 응답이 실패했습니다.');
                }
                console.log('푸시 토큰을 서버로 전송했습니다.');
            })
            .catch(error => {
                console.error('푸시 토큰을 서버로 전송하는 중 오류 발생:', error);
            });
    };

    // Notification 객체가 지원되지 않으면, 모달을 렌더링하지 않습니다.
    if (!accessToken || !isLogin || !isOpen || !notificationSupported || notificationPermission === 'granted' || notificationPermission === 'denied') {
        return null;
    }

    return (
        <>
            <div className="noti-modal-backdrop" onClick={onClose}></div>
            <div className="noti-modal">
                <h2>알림 설정</h2>
                <p>알림을 받으시겠습니까?</p>
                <button onClick={() => handleNotificationSelect(true)}>예</button>
                <button onClick={() => handleNotificationSelect(false)}>아니오</button>
            </div>
        </>
    );
};

export default NotificationModal;