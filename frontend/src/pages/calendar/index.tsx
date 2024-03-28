import { useEffect, useState } from 'react';
import { addDays, addMonths, format, subMonths } from 'date-fns'
import { DateList, DayList, MyModal, ShareModal }  from './components'
import writeDiary from 'src/asset/images/image-icon/write-btn.png'
import { LeftIcon, RightIcon } from 'src/components'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import useStore from './store';
import staticStore from 'src/store'
import loadMyDiary from 'src/asset/images/calendar/loadMyDiary.png'
import goToWriteDiary from 'src/asset/images/calendar/goToWriteDiary.png'
import { createPortal } from 'react-dom'
import useDate from 'src/util/date'
import styled from 'styled-components'
import { getCalendar, getShareCalendar } from './api';

const Title = styled.div`
    font-size: 35px;
    font-weight: 600;
    margin-bottom: 5px;
`

const CalendarWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  flex-direction: column;
`

const CalendarHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top:8%;
`

const CalendarHeaderRightWrapper =styled.button `
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-top: 10px;
  border: none;
  cursor: pointer;
  background-color: transparent;
`

const CalendarHeaderMiddleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px; 
  margin-top: 10px;
  margin-left: 18%;
  flex: 1;
`

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 400;
`

const WriteModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 400;
  background-color: rgba(0, 0, 0, 0.5);
`
    
const Modal = styled.div`
  height: 50%;
  width: 100%;
  background-color: #FFFEFC;
  position: fixed;
  bottom: 0;
  box-shadow: 0px -3px 0px 0px rgba(211, 211, 211, 0.2);
  border-radius: 10px 10px 0 0;
`

const WriteModal = styled.div`
  height: 30%;
  width: 40%;
  background-color: #FFF;
  box-shadow: 0px -3px 0px 0px rgba(211, 211, 211, 0.2);
  border-radius: 10px;
  position: fixed;
  padding: 10px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const ModalImg = styled.img`
  height: 80%;
  width: 40%;
  cursor: pointer;
  margin: auto;
`

const Calendar = () =>{

  const navigator = useNavigate()

  // const { state }  = useLocation(); // 메인에서 넘어온 데이터 사용
  // const { diaryId, type } = state;
  // console.log( diaryId, type );

  const [ isDiaryWrite, setIsDiaryWrite ] = useState<boolean>(false); // 일기쓰기 버튼 클릭시 개인/공유 분리
  const { currentMonth, setCurrentMonth, calculateDateRange } = useDate() // 달력 옆 버튼
  const { startDate, endDate } = calculateDateRange()
  const { isModalOpened, updateModal } = useStore() // Day 컴포넌트에서 업데이트 된 상태 가져오기
  const { diaryId, type } = staticStore();
  const html = document.querySelector( 'html' )

  const closeModal = () => { 
      updateModal()
      html?.classList.remove( 'scroll-locked' )
  }

  const closeWrite = () => { 
      setIsDiaryWrite(false)
      html?.classList.remove( 'scroll-locked' )
  }

  const ModalPortal = ({ children, onClose  }) => { 
    const handleBackgroundClick = (e) => {
      ( e.target === e.currentTarget ) && onClose()
    }
    return createPortal(
      <ModalBackground onClick={ handleBackgroundClick }>
        <Modal>{ children }</Modal>
      </ModalBackground>,
      document.body
    )
  }

  const loadDiary = () => {
    alert('얘기중..')
  }

  const goWrite = () => {
    // navigator(`/diary/write/${diaryId}`, { state: { diaryId:  diaryId, type: type }})
    navigator(`/diary/write/${diaryId}`)
  }

  const WriteModalPortal = ({ onClose  }) => { 
    const handleBackgroundClick = (e) => {
      ( e.target === e.currentTarget ) && onClose()
    }
    return createPortal(
      <WriteModalBackground onClick={ handleBackgroundClick }>
        <WriteModal>
          <div style={{display:'flex', height:'100%', justifyContent: 'space-around'}}>
            <ModalImg src={ loadMyDiary } alt='' onClick={ loadDiary } />
            <ModalImg src={ goToWriteDiary } alt='' onClick={ goWrite } />
          </div>
        </WriteModal>
      </WriteModalBackground>,
      document.body
    )
  }

  const goDiaryWrite = () =>{
    if(type==='개인'){
      // navigator(`/diary/write/${diaryId}`, {state: {diaryId:  diaryId ,type: type}})
      navigator(`/diary/write/${diaryId}`)
    }else{ //공유일 때
      setIsDiaryWrite(true)      
    }


  }
  

  const days = []
  let day = startDate

  while( day < endDate ){
    days.push( day )
    day = addDays( day, 1 )
  }

  const movePrevMonth = () =>{ setCurrentMonth( subMonths( currentMonth, 1) ) }
  const moveNextMonth = () => { setCurrentMonth( addMonths( currentMonth, 1) ) }

  
  const today = format(currentMonth, 'yyyy-MM-01') //월 데이터 전송 고정

  let queryKey = null; // 개인과 공유 키 분리
  let queryParams = null; // 개인과 공유 파람 분리

  if (type === '개인') {
    queryKey = ['calendars', currentMonth];
    queryParams = () => getCalendar(today);
  } else {
    queryKey = ['calendars', currentMonth];
    queryParams = () => getShareCalendar({ date: today, diaryId: diaryId });
  }

  const { data: calendars, refetch } = useQuery<any>(queryKey, queryParams);

  console.log(calendars?.data)
    
  useEffect(() => { refetch() }, [ currentMonth, refetch ])
  console.log("Calendar", calendars)
  
  return(
          <CalendarWrapper>
            <CalendarHeaderWrapper>
              <></>
            <CalendarHeaderMiddleWrapper>
              <LeftIcon size= { 31 } onClick={ movePrevMonth }/>
              <Title>{ format( currentMonth, 'yyyy' )}년 { format( currentMonth, 'M' )}월</Title>
              <RightIcon size= { 31 } onClick={ moveNextMonth }/>
            <CalendarHeaderRightWrapper onClick={ goDiaryWrite }>
                <img src={ writeDiary } alt='' style={{ height: '50px'}}/>
            </CalendarHeaderRightWrapper>
            </CalendarHeaderMiddleWrapper>
            </CalendarHeaderWrapper>
            
        { 
          isModalOpened && type==='개인'
          && 
            <ModalPortal onClose={ closeModal }>
              <Modal><MyModal schedules= { calendars?.data?.schedules }></MyModal></Modal>
            </ModalPortal>
        }

        { 
          isModalOpened && type==='공유'
          && 
            <ModalPortal onClose={ closeModal }>
              <Modal><ShareModal diaries= { calendars?.data?.members } diaryId = { diaryId } members= { calendars?.data?.members } /></Modal>
            </ModalPortal>
        }

        {
          isDiaryWrite && 
          <WriteModalPortal onClose={ closeWrite } />
        }

            <DateList/>
            <DayList list = { days } calendars = { calendars?.data } type = { type }/>
          </CalendarWrapper>
  )
}

export default Calendar