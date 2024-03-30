import axios from "axios";
import { useEffect } from "react";
import kakao from 'src/asset/images/kakao.png';
import styled from "styled-components";
import blurredlogo from "src/asset/images/image-icon/blur-logo.png";
import mainlogo from "src/asset/images/image-icon/mainlogo.png";

const API_KEY = process.env.REACT_APP_API_KEY
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI
const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=account_email`

const LoginWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh; /* 화면 높이에 맞춰 세로 중앙 정렬 */
    width:100%;
`;

const Login = () => {
    
    
    return(
        <LoginWrapper>
            <img src={ mainlogo }/>
            <img src={ blurredlogo }/>
            <a href={KAKAO_AUTH_URI}><img src= { kakao } style={{width:"230px", marginTop:"-50px"}}/></a>
        </LoginWrapper>
    );
}

export default Login;