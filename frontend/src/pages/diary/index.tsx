import { fabric } from 'fabric';
import { Drawer, MusicPlayer3, EditIcon, DecoIcon, DeleteIcon, BottomNavi } from 'src/components';
import { Canvas } from './components';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useNavigate } from "react-router-dom";
import { getDiary, deleteDiary, getEmotions, getComment } from './api';
import useStore from 'src/store'
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

const Tab = styled.button<{ $isDeco: boolean }>`
    width: 150px; 
    height: 60px; 
    background-color: ${( props ) => props.$isDeco ? "#FFFEFC" : "#EEEEEE"}; 
    font-color: ${( props ) => props.$isDeco ? "#262626" : "#9E9D9D"}; 
    font-weight: ${( props ) => props.$isDeco ? "bold" : "normal"}; 
    border: none;
    border-radius: 10px 10px 0 0;
    margin-left: 20px;
    font-size: 22px;
`;

const ResultSection = styled.div`
    width: 90%;
    text-align: left; 
    margin-top: 50px; 
    margin-bottom: 40px;
`

const Title = styled.span`
    font-size: 30px;
    font-weight: bold; 
    margin: 10px;
`;

const Emotion = styled.div<{ color: string }>`
    width: 120px; 
    height: 70px;
    border: 5px solid white;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    border-radius: 25px;
    background-color: ${( props ) => props.color };
    color: white;
    font-size: 28px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
`

const Comment = styled.div`
    height: auto;
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 60px;
    background-color: white;
    border-radius: 20px;
    font-size: 24px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    line-height: 40px;
`

const Diary = () => {
    const navigator = useNavigate();
    
    const { diaryId, dailyDiaryId, type  } = useStore(); 

    const emotionTag = {
        'angry': {name: '분노', color: '#F09690'},
        'embarrassed': {name: '당황', color: '#BBDED6'},
        'happy': {name: '기쁨', color: '#FFE17D'},
        'doubtful': {name: '불안', color: '#BDB5FF'},
        'comfortable': {name: '느긋', color: '#FFC814'},
        'sad': {name: '슬픔', color: '#C0DEFF'},
    }

    const canvasRef = useRef(null);
    const [ canvas, setCanvas ] = useState<fabric.Canvas>(null);
    const [ isFontLoaded, setIsFontLoaded ] = useState<boolean>(false);
    const [ isDeco, setIsDeco ] = useState<boolean>(true);

    const { data: dailyDiary } = useQuery('dailyDiary', () => getDiary(dailyDiaryId), {
        enabled: isFontLoaded
    });

    const { data: emotions } = useQuery('emotions', () => getEmotions(dailyDiaryId), {
        enabled: isFontLoaded
    });

    const { data: comment } = useQuery('comment', () => getComment(dailyDiaryId), {
        enabled: isFontLoaded
    });

    useEffect(() => {
        if(!canvas) return;
        // console.log('emotions', emotions);
        // console.log('comment', comment);

        canvas.loadFromJSON(dailyDiary?.data?.dailyContent, () => {
            canvas.renderAll();
            canvas.forEachObject((obj) => {
                obj.selectable = false;
            });
        });

        if( type === '공유' && isDeco ) {
            // 공유일기에서 '꾸민 일기'일 경우에만 랜더링
            const decoObjects = dailyDiary ? JSON.parse(dailyDiary?.data?.decoration) : null;
            fabric.util.enlivenObjects(decoObjects, (enlivenedObjects: any) => {
                enlivenedObjects.forEach((obj: any) => {
                    obj.selectable = false;
                    canvas.add(obj);
                });
                canvas.renderAll();
            }, null);
        }
    }, [ dailyDiary, isDeco ]);

    const removeDiary = useMutation( deleteDiary );

    const onClick = async () => {
        await removeDiary.mutateAsync(dailyDiaryId);
        navigator(`/calendar/${diaryId}`, {state: {diaryId: diaryId}});
    }
    return (
        <Container>
            <Header>
                <Drawer/>
                <span style={{ fontSize: "30px" }}>{ dailyDiary?.data?.dailyDate.substring(0, 10) }</span>
                <div style={{ display: "flex", alignItems: "center" }}>
                    {(type === '공유' && isDeco) && (
                        <DecoIcon size={ 55 } onClick={() => navigator(`/diary/deco/${ dailyDiaryId }`, {state: {dailyDiaryId: dailyDiaryId, type: type}})} />
                    )}
                    {/* 공유일기 + 원본일기 -> 본인 일기일 때만 버튼이 나와야 함 */}
                    {(((type === '개인') || (type ==='공유' && !isDeco) && (dailyDiary?.data.writerId === dailyDiary?.data.memberId))) && (
                        <EditIcon size={ 55 } onClick={() => navigator(`/diary/edit/${ dailyDiaryId }`, {state: {dailyDiaryId: dailyDiaryId, type: type}})} />
                    )}
                    {(dailyDiary?.data.writerId === dailyDiary?.data.memberId) && (
                        <DeleteIcon size={ 55 } onClick={ onClick } />
                    )}
                </div>
            </Header>
            {(type === '공유') && (
                <div style={{ width: "93%" }}>
                    <Tab onClick={() => setIsDeco(true)} $isDeco={ isDeco }>꾸민 일기</Tab>
                    <Tab onClick={() => setIsDeco(false)} $isDeco={ !isDeco }>원본 일기</Tab>
                </div>
            )}
            <Canvas canvasRef={ canvasRef } canvas={ canvas } setCanvas={ setCanvas } setIsFontLoaded={ setIsFontLoaded } />
            <ArrowDownwardRoundedIcon sx={{ fontSize: 40 }} style={{ paddingTop: "30px", marginBottom: "10px" }} />
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>분석 결과 보러 가기</div>
            <ResultSection>
                <Title>나의 감정은?</Title>
                <div style={{ marginTop: "20px", marginBottom: "60px", display: "flex" }}>
                    {emotions && emotions?.data?.emotionList?.map((emotion, index) => (
                        <Emotion key={index} color={ emotionTag[emotion].color }>
                            #{ emotionTag[emotion].name }
                        </Emotion>
                    ))}
                </div>
                {(type === '개인') && (
                    <>
                        <Title>AI 코멘트</Title>
                        <Comment>
                            { comment &&  comment?.data}
                        </Comment>
                    </>
                )}
                <Title>추천 음악</Title>
                <MusicPlayer3 />
            </ResultSection>
            <BottomNavi />
        </Container>
    )
};

export default Diary;