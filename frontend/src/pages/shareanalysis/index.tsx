import { Drawer } from "src/components/control/Drawer";
import { Button } from "src/components/control/Button";
import { Header } from "src/components/control/Header";
import { format } from 'date-fns'
import { useQuery } from 'react-query'
import { getMember } from "./api";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Switch } from "./components/Switch";
import { BottomNavi } from "src/components/control/BottomNavi";
import useStore from 'src/store'
import useDate from 'src/util/date'
import Monthly from "./components/Monthly/Monthly";
import styled from 'styled-components';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
);


const SwitchWrapper = styled(Switch)`
    display: flex;
    margin-left: auto;

    .TitleWrapper{
        align-items: flex-start;
    }
`;

const BoxWrapper = styled.div`
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    padding: 5px;
    justify-content: center;
    align-items: center;
    overflow: hidden; 
`;


const GraphWrapper = styled.div`
    width: 100%;
    max-width: 800px; 
    height: 30vh; 
    margin: auto; 

    display: flex; 
    justify-content: center; 
    align-items: center; 

    @media (max-width: 768px) {
        height: 25vh; 
    }

    @media (max-width: 480px) {
        height: 20vh;
    }
`;





const ShareAnalysis = () => {

    const [ keyType, setKeyType ] = useState( 1 ); 
    const [ happyDataSet, setHappyDataSet ] = useState( {
        labels: [],
        datasets: [],
    } );
    const [ sadDataSet, setSadDataSet ] = useState( {
        labels: [],
        datasets: [],
    } ); 
    const [ userName, setUserName ] = useState('')
    const { currentMonth } = useDate() 
    const { diaryId } = useStore()
    const today = format(currentMonth, 'yyyy-MM-dd')
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];


    //api
    const { data: memberData, refetch: refetchMember } = useQuery(['memberData'], getMember, {
        onSuccess: ( res ) => {
          setUserName( res.data.nickName );
          console.log( res.data );
        }
      });



    useEffect(()=>{
        getMember();

    },[]);


    const options = {
        scales: {
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1',
                },
                border: {
                    dash: [8,4],
                },  
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1',
                },
                border: {
                    dash: [8,4],
                },  
            }
        }
    };
    return(
        <>
                <Header>
                    <Drawer></Drawer>
                    <Button></Button>
                    <Button></Button>
                </Header>
                    <BoxWrapper>
                        <Monthly/>
                    </BoxWrapper>
                    <BoxWrapper>
                        <Monthly/>
                    </BoxWrapper>
                    <BottomNavi/>
                
        </>
    );

}

export default ShareAnalysis;