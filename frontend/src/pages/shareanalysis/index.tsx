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
import Chart from "./components/Chart/Chart";
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
  display: flex;
  flex-direction: row;
  justify-content: center; 
  align-items: center; 
  gap: 20px; 
  padding: 20px;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box; 
`;

const GraphContainer = styled.div`
  flex: 1; 
  display: flex;
  justify-content: center;
  align-items: center;

`;





const ShareAnalysis = () => {



    return(
        <>
                <Header>
                    <Drawer></Drawer>
                    <Button></Button>
                    <Button></Button>
                </Header>
                    <BoxWrapper>
                        <Chart/>
                    </BoxWrapper>
                    <BoxWrapper>
                        <Chart/>
                    </BoxWrapper>
                    <BottomNavi/>
                
        </>
    );

}

export default ShareAnalysis;