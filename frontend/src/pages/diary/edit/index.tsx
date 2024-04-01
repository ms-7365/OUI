import { SaveIcon, BackIcon } from 'src/components';
import { BottomSheet, Canvas } from '../components';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useMutation, useQuery } from 'react-query';
import useStore from 'src/store';
import { getDiary, putDiary } from '../api';
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

const DiaryEdit = () => {
    const navigator = useNavigate();

    const { dailyDiaryId } = useStore();

    const canvasRef = useRef(null);
    const textboxRef = useRef(null);

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    const todayDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const [ textboxProps, setTextboxProps ] = useState({
        selectedFont: 'Dovemayo',
        fontWeight: 'normal',
        textAlign: 'left',
        fontColor: '#262626',
    });
    const [ canvas, setCanvas ] = useState(null);
    const [ isFontLoaded, setIsFontLoaded ] = useState(false);
    const [ activeTool, setActiveTool ] = useState("textbox");
    const [ selectedDate, setSelectedDate ] = useState(todayDate);

    const { data: dailyDiary } = useQuery('dailyDiary', () => getDiary(dailyDiaryId), {
        enabled: isFontLoaded
    });

    useEffect(() => {
        if(!canvas) return;

        setSelectedDate(dailyDiary?.data?.dailyDate.substring(0, 10));

        canvas.loadFromJSON(dailyDiary?.data?.dailyContent, () => {
            canvas.renderAll();
            canvas.forEachObject((obj) => {
                if(obj.type === "textbox") {
                    textboxRef.current = obj;
                    setTextboxProps({
                        selectedFont: textboxRef.current.fontFamily,
                        fontWeight: textboxRef.current.fontWeight,
                        textAlign: textboxRef.current.textAlign,
                        fontColor: textboxRef.current.fill,
                    });
                }
            });
        });
    }, [ dailyDiary ]);

    const editDiary = useMutation( putDiary );

    // 저장
    const saveDiary = async () => {
        // string으로 전달
        const diaryToString = JSON.stringify(canvas.toJSON());

        const data = { 
            dailyDiaryId: dailyDiaryId, 
            dailyDate: selectedDate, 
            dailyContent: diaryToString 
        };

        await editDiary.mutateAsync(data);
        // navigator(`/diary/${dailyDiaryId}`, {state: {dailyDiaryId: dailyDiaryId, type: type}});
        navigator(`/diary/${dailyDiaryId}`);
    }

    return (
        <Container>
            <Header>
                <BackIcon size={ 40 } onClick={() => { navigator(`/diary/${dailyDiaryId}`)}} />
                <span style={{ fontSize: "30px" }}>{ dailyDiary?.data?.dailyDate.substring(0, 10) }</span>
                <SaveIcon size={ 70 } onClick={ saveDiary }/>
            </Header>
            <Canvas canvasRef={ canvasRef } textboxRef={ textboxRef } canvas={ canvas } setCanvas={ setCanvas } activeTool={ activeTool } setIsFontLoaded={ setIsFontLoaded } />
            <BottomSheet activeTool={ activeTool } setActiveTool={ setActiveTool } canvas={ canvas } textboxRef={ textboxRef } textboxProps={ textboxProps } setTextboxProps={ setTextboxProps } />
        </Container>
    );
};

export default DiaryEdit;