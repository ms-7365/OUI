import music from 'src/asset/images/research/research.png';
import research1 from 'src/asset/images/image-icon/research1.png';
import research2 from 'src/asset/images/image-icon/research2.png';
import { useNavigate } from 'react-router-dom'
import { postPreference } from './api';
import styled from "styled-components";

const QuestionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%; // 전체 너비 사용
  height: 500px;
  padding-top:200px;
  
`;

const Research = () => {

  const navigator = useNavigate()

  const Preference = ( data: string ) =>{
    postPreference({ type: data }).then(()=>{
      navigator('/main')
    })
  }

  return (
    <>
      <QuestionWrapper>
        <img src={music} style={{marginBottom:'80px', marginTop:'15%'}}/>
        <div style={{fontSize:'31px', marginBottom:'10px'}}>
        비도 오고 유독 기분이 우중충한 하루.. 어떤 음악을 듣고 싶나요?
        </div>
          <img src={research1} style={{width:'78%', marginBottom:'-40px', cursor:'pointer'}} onClick={()=>{Preference('표현')}}/>
          <img src={research2} style={{width:'78%', cursor:'pointer'}} onClick={()=>{Preference('자유')}}/>
      </QuestionWrapper>
    </>
  );
}

export default Research;
