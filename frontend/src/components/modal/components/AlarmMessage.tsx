import { useState } from "react";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; 
import styled from "styled-components";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";


const IconType = {
    0: MailOutlineIcon,
    1: CampaignOutlinedIcon,
    2: ColorLensOutlinedIcon,
    3: ModeEditOutlinedIcon,
}

//테스트용
const TitleType = {
    0: '공유 다이어리 초대',
    1: '너 오늘 일기 안 써?!',
    2: '일기 작성',
    3: '0000 다이어리',
}

const AlarmWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    width: 100%;
`;

const StringWrapper = styled.div`
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    flex-grow: 1;
    width: 100%;
`;

const IconWrapper = styled.div`
    width: 24px;
    margin-right: 5%;
`;

const ActionsWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px; 
    margin-right: 2%;
`;
const AcceptButton = styled(Button)`
  background-color: #88B3E2;
  color: white;
  &:hover {
    background-color: #88B3E2; 
    border: 0px;
  }
  border: 0px;
  @media (max-width: 600px) {
    font-size: 0.75rem; 
    padding: 6px 12px; 
  }
  @media (max-width: 600px) {
    font-size: 0.75rem; 
    padding: 6px 12px; 
  }
`;

const RejectButton = styled(Button)`
  background-color: #F09690;
  color: white;
  &:hover {
    background-color: #F09690;
    border: 0px;
  }
  border: 0px;
  @media (max-width: 600px) {
    font-size: 0.75rem; 
    padding: 6px 12px; 
  }
  @media (max-width: 600px) {
    font-size: 0.75rem; 
    padding: 6px 12px; 
  }
`;


    const AlarmMessage = ( { alarmType, onClick }: AlarmProps  ) => {
    

    const [ alarmTitle, setAlarmtitle ] = useState( '' );
    const [ alarmContent, setAlarmContent ] = useState( 'gggg' );

    const SelectedIcon = IconType[ alarmType ];
    const Title = TitleType[ alarmType ]

    return(
        <>
            <AlarmWrapper>
                <div style={{ display:'flex', flexDirection: 'row', marginLeft: '2%' }}>
                    <IconWrapper>
                        <SelectedIcon />
                    </IconWrapper>
                    <StringWrapper>
                        <div>{Title}</div>
                        <div>{alarmContent}</div>
                    </StringWrapper>
                </div>
                <ActionsWrapper>
                    {alarmType === 0 ? (
                        <>
                            <AcceptButton variant="contained" onClick={() => console.log('수락')}>수락</AcceptButton>
                            <RejectButton variant="outlined" onClick={() => console.log('거절')}>거절</RejectButton>
                        </>
                    ) : (
                        <IconButton onClick={onClick}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    )}
                </ActionsWrapper>
            </AlarmWrapper>
            <hr></hr>
        </>
    );

    }


type AlarmProps = {
    alarmType: number,
    onClick?: () => void,
}

export default AlarmMessage;