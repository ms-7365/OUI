import { useState } from "react";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; 
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import styled from "styled-components";



const IconType = {
    'Invite': MailOutlineIcon,
    'SystemForcing': CampaignOutlinedIcon,
    'FriendForcing': ColorLensOutlinedIcon,
    'FriendDiary': ModeEditOutlinedIcon,
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


    const AlarmMessage = ( { Type, Title, Content ,onClick, diaryId, Accept, Refuse, link, alarmId }: AlarmProps  ) => {
    
    const SelectedIcon = IconType[ Type ];

        return(
            <>
                <AlarmWrapper>
                    <div style={{ display:'flex', flexDirection: 'row', marginLeft: '2%' }}>
                        <IconWrapper>
                            <SelectedIcon />
                        </IconWrapper>
                        <StringWrapper>
                            <div>{ Title }</div>
                            <div>{ Content }</div>
                        </StringWrapper>
                    </div>
                    <ActionsWrapper>
                        { Type === "Invite" ? (
                            <>
                                <AcceptButton variant="contained" onClick={() => Accept(diaryId)}>수락</AcceptButton>
                                <RejectButton variant="outlined" onClick={() => Refuse(diaryId)}>거절</RejectButton>
                            </>
                        ) : (
                            <IconButton onClick={()=>{ onClick( link, alarmId ) }}>
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
    Type: string,
    Title?: string,
    Content?: string,
    onClick?: (link: string, alarmId: number) => void,
    diaryId?: number,
    Accept?: ( diaryId: number ) => void,
    Refuse?: ( diaryId: number ) => void,
    link?: string,
    alarmId?: number,
}

export default AlarmMessage;