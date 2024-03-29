import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AlarmMessage } from "./components";
import { getAlarm } from "./api";
import styled from "styled-components";


const PaperWrapper = styled( Paper )`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%; 
  max-width: 900px; 
  height: 80%; 
  max-height: 90vh; 
  overflow-y: auto; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 20px;
`;

const StyledPaper = styled(Paper)`
  width: 100%; 
  height: 90%;
  margin: auto;
  padding: 50px; 
  box-sizing: border-box;
  overflow-y: auto; 
`;
const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px; 
`;

const TitleWrapper = styled.div`
  text-align: center;
  flex-grow: 1;
`;

const DeleteWrapper = styled.div`
  cursor: pointer;
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  margin-bottom: 0px;
  padding-bottom: 0px;
`;

function AlarmModal({ isOpen, closeModal }) {

  const [ alarmList, setAlarmList ] = useState([ ]);


  useEffect(()=>{
    getAlarm().then((res)=>{
      setAlarmList([ ...res.data ])
      console.log(alarmList);
    }).catch((err)=>{
      console.log( err )
    })
  }, [isOpen])

  return (
    <Modal open={ isOpen } onClose={closeModal}>
      <PaperWrapper>
        <IconButton onClick={closeModal} sx={{ position: 'absolute', right: 16, top: 8, zIndex: 2 }}>
          <CloseIcon />
        </IconButton>
        <StyledPaper elevation={2}>
          <MainWrapper>
            <div style={{ width: "50px" }}></div>
            <TitleWrapper>알림</TitleWrapper>
            <DeleteWrapper onClick={() => console.log('삭제삭제')}>전체삭제</DeleteWrapper>          
          </MainWrapper>
          <hr />
          {
            alarmList.map((alarm, index) => (
              <AlarmMessage key={index} Type={ alarm.alarmContentType } Title={ alarm.title } Content={ alarm.content }  />
            ))
          }
        </StyledPaper>
      </PaperWrapper>
    </Modal>
  );
}

export default AlarmModal;