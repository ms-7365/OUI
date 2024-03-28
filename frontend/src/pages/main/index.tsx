import { useState, useEffect } from "react";
import { Card } from "src/pages/main/components/Card";
import { Header } from "src/components/control/Header";
import { Button } from "src/components";
import { CustomModal } from "./components/Modal";
import { AlarmModal } from "src/components/modal";
import { getDiary, getMember, postCreateDiary } from './api';
import ya from 'src/asset/images/ya.jpg';
import { useQuery } from 'react-query'
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from "styled-components";

const SliderWrapper = styled( Slider )`
  
  .slick-track{
    display: flex;
    margin: 0 -10px;

  }

  .slick-slide {
    padding:0;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(0.8); 
    opacity: 0.5;
    transition: transform 0.5s ease, opacity 0.5s ease;
  }

  .slick-slide > div { 
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }

  .slick-center {
    transform: scale(1); 
    opacity: 1;
    display: flex;
    alignItems: center;
    justifyContent: center; 
    z-index: 10;
  }

  .slick-slide:not(.slick-center) > div {
    background-image: none !important; 
  }

`;


const YellowBox = styled.div`

  width: 500px;
  height: 8vh;
  background-color: #FFE17D;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  margin-top: 4vh;
  margin-bottom: 4vh;
  align-items: center;
  margin-left: 5%;
  @media (max-width: 768px) {
    margin-left: 2%; 
    width: 50vw;
  }

  @media (max-width: 480px) {
    margin-left: 1%; 
    width: 50vw;
    height: 4vh;
  }
  position: relative;
`;

const UserRecord = styled.div`
  position: absolute;
  top: -40px; 
  background: transparent;
  padding: 5px 10px;
  border: 0px;
  font-size: 60px;
  font-family: "Dovemayo",
  @media (max-width: 768px) {
    font-size: 35px;
    top: -30px; 
  }

  @media (max-width: 480px) {
    font-size: 20px;
    top: -20px; 
  }
`;

const ProfileImage = styled.img`
  width: 30%;
  max-width: 150px;
  max-height: 150px;
  height: 30%;
  border-radius: 50%;
  object-fit: cover;
`;


const Main = () => {

  const settings = {
    className: 'center',
    infinite: false,
    centerMode: true, 
    focusOnSelect: true,
    slidesToShow: 3,
    speed: 500,
  };

  const navigator = useNavigate()

  const [ isModalOpen, setIsModalOpen ] = useState( false );
  const [ diaryList, setDiaryList ] = useState( [] );
  const [ userName, setUserName ] = useState( "" );
  const [ userImage, setUserImage ] = useState( null );
  const [ modalSubmitted, setModalSubmitted ] = useState( false );
  const [ alarmModalOpen, setAlarmModalOpen ] = useState(false);

  const openModal = () => setIsModalOpen( true );
  const closeModal = () => {
    console.log( '모달 닫기!!!!!!' );
    setIsModalOpen( false );
  }

  const addCard = ( props: { title: string; key: number; members: String[]; } ) => {
    const { title, key, members } = props;
    const templateId = key; 
    const data = {
      diaryName: title,
      templateId: templateId,
      members: members,
    };
  
    try {
      const response = postCreateDiary( data ).then(
        ()=>{
          setModalSubmitted( true );
        }
      );
      console.log( '추가추가:', response );
      closeModal();
    } catch ( error ) {
      console.error( '생성실패:', error );
    }
  };

  const cards = diaryList.map(( diary ) => ({
    id: diary.diaryId,
    buttonText: diary.createdAt,
    isDiary: "diary",
    template: diary.templateId,
    type: diary.type,
  })).concat({
    id: diaryList.length,
    buttonText: "카드 추가",
    isDiary: "addButton",
    template: -1,
    type: "",
  });

  const moveDiary = ( type: string, id: number ) => {
    type=='개인' && 
    navigator('/calendar', {state : {diaryId: id, type: type}})
    type=='공유' && 
    navigator(`/calendar/${ id }`, {state : {diaryId: id, type: type}})
  }

  const { data: diaryData, refetch: refetchDiary } = useQuery(['diaryData'], getDiary, {
    onSuccess: ( res ) => {
      const updatedDiaryList = res.data.map(( diary: { createdAt: any[]; }) => ({
        ...diary,
        createdAt: `${ diary.createdAt[0] }.${ diary.createdAt[1] }.${ diary.createdAt[2] }`,
      }));
      setDiaryList( updatedDiaryList );
      console.log( res.data );
    }
  });
  
  const { data: memberData, refetch: refetchMember } = useQuery(['memberData'], getMember, {
    onSuccess: ( res ) => {
      setUserImage( res.data.img );
      setUserName( res.data.nickName );
      console.log( res.data );
    }
  });
  
  useEffect(() => {
    if ( modalSubmitted ) {
      refetchDiary();
      refetchMember();
      setModalSubmitted( false );
    }
  }, [ modalSubmitted, refetchDiary, refetchMember]);


  return (
    <>
    <Header>
      <ProfileImage src={ userImage || ya } alt="유저 프로필 이미지" />
      <Button btType='bell' onButtonClick={() => setAlarmModalOpen(true)} />
    </Header>
    <YellowBox>
        {userName && <UserRecord style={{ fontWeight: 'bold' }}>{ userName }님의 감정기록 :)</UserRecord>}
    </YellowBox>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="slider-container" style={{ minHeight: '100%', minWidth: '100%' }}>      
        <SliderWrapper { ...settings }>
        {cards.map(( card, index ) => (
          <div key={index}>
            <Card buttonText={ card.buttonText } templateId={ card.template } 
              onClick={ card.isDiary === "addButton" ? openModal : () => moveDiary( card?.type, card.id ) } />
          </div> 
        ))}
          <Card/>
          <Card/>
        </SliderWrapper>
      </div>
    </div>
    <AlarmModal isOpen={ alarmModalOpen } closeModal={() => setAlarmModalOpen(false)} />
    <CustomModal isOpen={ isModalOpen } closeModal={ closeModal } isFinish={ addCard } />
    </>
  );
}

export default Main;