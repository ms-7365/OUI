import { fabric } from 'fabric';
import { SaveIcon, BackIcon } from 'src/components';
import { BottomSheet, Canvas } from '../components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useMutation, useQuery } from 'react-query';
import { getDiary, postDiaryDeco } from '../api';
// import { Stomp } from "@stomp/stompjs";
// import SockJS from "sockjs-client";
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

const DiaryDeco = () => {
    const navigator = useNavigate();
    
    const { state } = useLocation();
    const { dailyDiaryId, type } = state;

    const canvasRef = useRef(null);
    let stompClient = useRef(null);
    
    const [ canvas, setCanvas ] = useState(null);
    const [ isFontLoaded, setIsFontLoaded ] = useState(false);
    const [ activeTool, setActiveTool ] = useState("image");
    
    // const storedDataString = localStorage.getItem('userStorage');
    // const storedData = JSON.parse(storedDataString);
    // const accessToken = storedData?.state?.accessToken;
    
    // useEffect(() => {
    //     const socket = new SockJS(process.env.REACT_APP_BASE_URL + '/ws');
    //     stompClient.current = Stomp.over(socket);
        
    //     stompClient.current.connect(
    //         {
    //             Authorization : `Bearer ${ accessToken }`,
    //         }, 
    //         (frame) => {
    //             stompClient.current.subscribe(`/sub/decorate/${dailyDiaryId}`, (message) => {
    //                 const { decoObject } = JSON.parse(message.body);
    //                 console.log('decoObject', decoObject);
    //                 canvas.add(decoObject);
    //             });
    //         });
            
    //     return () => {
    //         stompClient.current.disconnect();
    //     };
    // }, [])
        
    const { data: dailyDiary } = useQuery('dailyDiary', () => getDiary(dailyDiaryId), {
        enabled: isFontLoaded
    });
        
    // useEffect(() => {
    //     if(!canvas) return;

    //     canvas.on('object:added', (event) => {
    //         const addedObject = event.target;
    //         console.log('addedObject:', addedObject);

    //         stompClient.current.send(
    //             `/pub/decorate/${dailyDiaryId}`,
    //             {},
    //             JSON.stringify(addedObject),
    //         )
    //     })
    // }, [canvas])

    useEffect(() => {
        if(!canvas) return;

        // 1. 일기 작성자가 쓴 일기 -> 백그라운드로 선택되지 않게!
        const dailyContent = dailyDiary?.data?.dailyContent;
        // JSON으로부터 캔버스 로드 후, 모든 객체를 선택 불가능하게 설정
        canvas.loadFromJSON(dailyContent, () => {
            canvas.renderAll();
            // 모든 객체를 순회하면서 selectable 속성을 false로 설정
            canvas.forEachObject((obj) => {
                obj.selectable = false;
            });
        });

        // 2. 친구들이 꾸민 객체들
        const decoObjects = dailyDiary ? JSON.parse(dailyDiary?.data?.decoration) : null;
        fabric.util.enlivenObjects(decoObjects, (enlivenedObjects: any) => {
            enlivenedObjects.forEach((obj: any) => {
                obj.selectable = true;
                canvas.add(obj); // 각 객체를 캔버스에 추가
            });
            canvas.renderAll(); // 모든 객체가 추가된 후 캔버스를 다시 그림
        }, null);
    }, [ dailyDiary ]);

    const decoDiary = useMutation( postDiaryDeco );

    // 저장
    const saveDiary = async () => {
        // canvas에서 selectable이 true인 객체들만 필터링
        const decoObjects = canvas.getObjects().filter((obj: any) => obj.selectable);

        // 필터링된 객체들을 JSON 문자열로 변환
        const decoration = JSON.stringify(decoObjects.map((obj: any) => obj.toJSON()));

        const data = {
            dailyDiaryId: dailyDiaryId,
            decoration: decoration,
        }

        await decoDiary.mutateAsync(data);
        navigator(`/diary/${dailyDiaryId}`, {state: {dailyDiaryId: dailyDiaryId, type: type}});
    }

    return (
        <Container>
            <Header>
                <BackIcon size={ 40 } onClick={ () => { navigator(`/diary/${dailyDiaryId}`, {state: {dailyDiaryId: dailyDiaryId, type: type}}) }} />
                <SaveIcon size={ 70 } onClick={ saveDiary }/>
            </Header>
            <Canvas canvasRef={ canvasRef } canvas={ canvas } setCanvas={ setCanvas } activeTool={ activeTool } setIsFontLoaded={ setIsFontLoaded } />
            <BottomSheet activeTool={ activeTool } setActiveTool={ setActiveTool } canvas={ canvas } isDeco={ true } />
        </Container>
    );
};

export default DiaryDeco;