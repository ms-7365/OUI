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

const DoughnutWrapper = styled.div`
  width: 100%;
  height: auto;
  margin: auto; 
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const ChartContainer = styled.div`
  flex: 1;
  padding: 20px;
  transition: transform 0.2s ease-in-out;
`;


const Chart = () => {

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
    labels: [
        'Red',
        'Blue',
        'Yellow'
      ],
      datasets: [{
        label: '임시',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
  });
  const [ emotionScores, setEmotionScores ] = useState({ });
  const [ selectedChart, setSelectedChart ] = useState( null ); 

    const handleClick = ( chartIndex ) => () => {
        if ( selectedChart === chartIndex ) {
            setSelectedChart( null );
        } else {
            setSelectedChart( chartIndex );
        }
    };



  return(
      <>
          <ChartBoxWrapper>
            <DoughnutWrapper>
            {[0, 1].map(( index ) => (
            <ChartContainer
              key={ index }
              style={{ transform: selectedChart === index ? 'scale(1.1)' : selectedChart !== null ? 'scale(0.9)' : 'scale(1)' }}>
              <Doughnut
                data={ chartData }
                options={{ onClick: handleClick( index )}}/>
            </ChartContainer>
          ))}  
            </DoughnutWrapper>
            <IconWrapper>
              {Object.entries( images ).map(([ emotion, image ], index ) => (
                <ImageWrapper  key={ index }>
                  <img src={ image } alt={ emotion } />
                  <EmotionTagWrapper>{tags[ emotion ]}</EmotionTagWrapper>
                  <EmotionScoreWrapper>{emotionScores[ tags[ emotion ]] || 0}%</EmotionScoreWrapper>
                </ImageWrapper >
              ))}
            </IconWrapper>
          </ChartBoxWrapper>

      </>
      
  );
}
export default Chart;