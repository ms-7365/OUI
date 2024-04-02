import { fabric } from 'fabric';
import { SaveIcon, BackIcon } from 'src/components';
import { DateSelect, BottomSheet, Canvas } from '../components';
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation } from 'react-query';
import useStore from 'src/store';
import { postDiary, getDiaryByDate } from '../api';
import styled from 'styled-components';

const Header = styled.div`
    width: 93%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    margin: 30px 0;
`

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const DiaryWrite = () => {

    const navigator = useNavigate();

    const { diaryId, type } = useStore();

    const canvasRef = useRef(null);
    const textboxRef = useRef<fabric.Textbox>(null);
    const [ canvas, setCanvas ] = useState<fabric.Canvas>(null);
    const [ activeTool, setActiveTool ] = useState("textbox");
    const [ selectedDate, setSelectedDate ] = useState('');
    const [ textboxProps, setTextboxProps ] = useState({
        selectedFont: 'JGaegujaengyi',
        fontWeight: 'normal',
        textAlign: 'left',
        fontColor: '#262626',
    });
    
    useEffect(() => {
        if(!canvas) return;

        // 텍스트박스 추가
        const textbox = new fabric.Textbox('', {
            left: 60,
            top: 60,
            width: 400,
            fontSize: 24,
            fontFamily: "JGaegujaengyi",
            fill: "#262626",
            textAlign: "left",
            fontWeight: "normal",
            padding: 10,
        });
        canvas.add(textbox);
        
        textboxRef.current = textbox; // 텍스트박스 ref 설정

        canvas.setActiveObject(textbox);
    }, [ canvas ]);


    const writeDiary = useMutation( postDiary );
    
    const goCalendar = () => {
        if(type === '개인') {
            // navigator(`/calendar`, {state: {diaryId: diaryId, type: type}});
            navigator(`/calendar`);
        } else {
            // navigator(`/calendar/${diaryId}`, {state: {diaryId: diaryId, type: type}});
            navigator(`/calendar/${diaryId}`);
        }
    }

    // 저장
    const saveDiary = async () => {
        // string으로 전달
        const textbox = canvas.getObjects()[0].toJSON();
        const textSize =  textbox["text"].length;

        if(textSize <11) {
            alert('글자를 10글자 이상 입력해주세요.');
            return;
        }
        
        const diaryToString = JSON.stringify(canvas.toJSON());
        
        const data = {
            diaryId,
            dailyDate: selectedDate,
            dailyContent: diaryToString,
        };


        const diary = await getDiaryByDate({ diaryId: diaryId, date: selectedDate });
        if(!diary.data) {
            await writeDiary.mutateAsync(data);
            goCalendar();
        } else {
            alert('이미 일기가 작성된 날짜입니다.');
        }
    }

    return (
        <Container>
            <Header>
                <BackIcon size={ 40 } onClick={ goCalendar }/>
                <DateSelect setSelectedDate={ setSelectedDate }/>
                <SaveIcon size={ 70 } onClick={ saveDiary }/>
            </Header>
            <Canvas canvasRef={ canvasRef } textboxRef={ textboxRef } canvas={ canvas } setCanvas={ setCanvas } activeTool={ activeTool } />
            <BottomSheet activeTool={ activeTool } setActiveTool={ setActiveTool } canvas={ canvas } textboxRef={ textboxRef } textboxProps={ textboxProps } setTextboxProps={ setTextboxProps }/>
        </Container>
    );
};

export default DiaryWrite;
