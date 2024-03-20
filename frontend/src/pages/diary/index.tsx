import { fabric } from 'fabric';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import WebFont from 'webfontloader';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #F9F3EE;
`;

const Diary = () => {
    const canvasRef = useRef(null);

    const navigator = useNavigate();
    
    useEffect(() => {
        
        // 캔버스 생성
        const newCanvas = new fabric.Canvas(canvasRef.current, {
            width: 950,
            height: 1100,
            backgroundColor: '#FFFEFC'
        });

        fabric.Object.prototype.set({
            cornerSize: 7,
            cornerStyle: 'rect',
            transparentCorners: false,
            cornerColor: '#CDCDCD',
            borderColor: '#CDCDCD',
        });
        
        const dailyDiaryId = 20;

        WebFont.load({
            custom: {
                families: ['DoveMayo', 'DoveMayoBold', 'IMHyeMin', 'IMHyeMinBold', 'Cafe24Supermagic', 'Cafe24SupermagicBold', 'HakgyoansimGaeulsopung', 'HakgyoansimGaeulsopungBold'], // 사용하려는 폰트 목록
                urls: ['src/asset/fonts'] // 폰트를 정의한 CSS 파일의 경로
            },
            active: () => {
                getDiary(dailyDiaryId);
            }
        });

        const getDiary = (dailyDiaryId: number) => {
            axios({
                url: `http://localhost:8080/diary/${dailyDiaryId}`,
                method: 'GET'
            })
            .then((resp) => {
                const data = resp.data;
                // JSON으로부터 캔버스 로드 후, 모든 객체를 선택 불가능하게 설정
                newCanvas.loadFromJSON(data.dailyContent, () => {
                    newCanvas.renderAll();
                    // 모든 객체를 순회하면서 selectable 속성을 false로 설정
                    newCanvas.forEachObject((obj) => {
                        obj.selectable = false;
                    });
                });
            });
        }

        // 언마운트 시 캔버스 정리
        return () => {
            newCanvas.dispose();
        };
    }, []);

    return (
        <Container>
            <button onClick={() => navigator('/diarywrite')}>일기 쓰기</button>
            <button onClick={() => navigator('/diaryedit')}>일기 수정</button>
            <canvas id="canvas" style={{ border: "1px solid #9E9D9D"  }} ref={ canvasRef }/>
        </Container>
    )
};

export default Diary;