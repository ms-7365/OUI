import { useEffect, useState } from 'react';
import { Doughnut } from "react-chartjs-2";
import { getMonthly, getMember } from '../../api';
import { LeftIcon, RightIcon } from 'src/components'
import { addMonths, format, subMonths } from 'date-fns'
import useDate from 'src/util/date'
import { useQuery } from 'react-query'
import angry from 'src/asset/images/emotion/angry.png';
import embarrassed from 'src/asset/images/emotion/embarrass.png';
import happy from 'src/asset/images/emotion/joy.png';
import doubtful from 'src/asset/images/emotion/nervous.png';
import comfortable from 'src/asset/images/emotion/relax.png';
import sad from 'src/asset/images/emotion/sad.png';
import styled from "@emotion/styled";


const IconWrapper = styled.div`
  max-width: 1024px;
  display: flex;
  flex-direction: row; 
  justify-content: space-evenly; 
  flex-wrap: wrap; 
  margin: auto; 

  img, div {
    flex: 1 1 auto;
    max-width: 100px; 
    margin: 10px; 
    height: auto; 

    @media (max-width: 768px) {
      max-width: 50px; 
    }
  }
`;
const ChartBoxWrapper = styled.div`
  background-color: white; 
  border-radius: 10px; 
  padding: 20px; 
  margin: 20px 0; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  justify-content: center; 
  align-items: center;
  @media (max-width: 768px) {
    width: 95%; 
    padding: 15px;
  }

  @media (max-width: 480px) {
    width: 100%; 
    padding: 10px;
  }
`;

const EmotionTagWrapper = styled.div`
  font-family: 'IMHyeMin', sans-serif; 
  font-size: 25px;
  font-weight: bold;
  color: #333;
  margin-top: 8px; // 간격 조정 예시
`;

const EmotionScoreWrapper = styled.div`
  font-family: 'IMHyeMin', sans-serif; 
  font-size: 18px;
  font-weight: bold;
  color: #666;
  margin-bottom: 12px;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const TitleWrapper = styled.div`
  font-family: 'IMHyeMin', sans-serif;
  font-weight: bold;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 70%;
  font-size: 16px;
  text-align: left; 
  margin-left: 20px; 
  margin-bottom: 10px; 
`;

const DoughnutWrapper = styled.div`
  width: 75%;
  height: auto;
  margin: auto; 

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const CalendarHeaderMiddleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 30px; 
  width: 70%;
  margin-top: 10px;
  flex: 1;
`

const Title = styled.div`
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
    justify-content: flex-start;
`


const Monthly = () => {

  const tags = {
    sad: '슬픔',
    doubtful: '불안',
    angry: '분노',
    embarrassed: '당황',
    comfortable: '느긋',
    happy: '기쁨',

  }

  const images = {
    sad: sad,
    doubtful: doubtful,
    angry: angry,
    embarrassed: embarrassed,
    comfortable: comfortable,
    happy: happy,
  };

  const colors = {
    sad: '#C0DEFF',
    doubtful: '#BDB5FF',
    angry: '#F09690',
    embarrassed: '#BBDED6',
    comfortable: '#FFC814',
    happy: '#FFDD6B',
  }


  const [ chartData, setChartData ] = useState({
      labels: [],
      datasets: [],
  });
  const [ emotionScores, setEmotionScores ] = useState({});
  const [ userName, setUserName ] = useState( "" );
  const { currentMonth, setCurrentMonth } = useDate() 
  const today = format(currentMonth, 'yyyy-MM-01')

  const movePrevMonth = () =>{ setCurrentMonth( subMonths( currentMonth, 1) ) }
  const moveNextMonth = () => { setCurrentMonth( addMonths( currentMonth, 1) ) }

  const { data: memberData, refetch: refetchMember } = useQuery(['memberData'], getMember, {
    onSuccess: ( res ) => {
      setUserName( res.data.nickName );
      console.log( res.data );
    }
  });

  useEffect(() => {

      getMonthly({ diaryId: 19, date: today }).then(
      res => {
        const emotionLabels = Object.keys(res.data);
        const emotionData = Object.values(res.data).map(score => (score as number) * 100);
        const backgroundColors = emotionLabels.map(emotion => colors[emotion] || '#CCCCCC'); 
        const emotiontags = emotionLabels.map(label => tags[label] || label);

        const scores = emotionLabels.reduce((acc, label, index) => {
          acc[tags[label] || label] = emotionData[index];
          return acc;
        }, {});
        setEmotionScores(scores);


        setChartData({
            labels: emotiontags,
            datasets: [{
                data: emotionData,
                fill: true,
                backgroundColor: backgroundColors,
                borderColor: 'transparent',
            }]
        });
    })
      .catch(error =>{
        alert("감정을 가져오지 못했습니다")
      })
      refetchMember();
  }, [ currentMonth ]); 

  return(
      <>
          <CalendarHeaderMiddleWrapper>
              <LeftIcon size= { 20 } onClick={ movePrevMonth }/>
              <Title>{ format( currentMonth, 'yyyy' )}년 { format( currentMonth, 'M' )}월</Title>
              <RightIcon size= { 20 } onClick={ moveNextMonth }/>
          </CalendarHeaderMiddleWrapper>
           { userName && <TitleWrapper> { userName }님이 3월에 느낀 “감정 통계” 예요! </TitleWrapper>}
          <ChartBoxWrapper>
              <DoughnutWrapper>
                <Doughnut data={chartData}></Doughnut>
              </DoughnutWrapper>

            <IconWrapper>
              {Object.entries(images).map(([emotion, image], index) => (
                <ImageWrapper  key={index}>
                  <img src={image} alt={emotion} />
                  <EmotionTagWrapper>{tags[emotion]}</EmotionTagWrapper>
                  <EmotionScoreWrapper>{emotionScores[tags[emotion]] || 0}%</EmotionScoreWrapper>
                </ImageWrapper >
              ))}
            </IconWrapper>
          </ChartBoxWrapper>

      </>
      
  );
}
export default Monthly;