import { useState, useEffect } from 'react';
import { TextboxContent, ImageContent, DrawingContent } from '../components';
import styled from 'styled-components';

const Container = styled.div`
  margin: auto; 
  max-width: 1024px; 
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px 20px 0 0;
`;

const Header = styled.div`
  height: 60px;
  padding: 10px 30px;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid lightgray;
`;

const Tab = styled.button`
    box-sizing: border-box;
    display: inline-block;
    border: none;
    cursor: pointer;
    background-color: transparent;
    font-size: 24px;
`

const Content = styled.div`
  max-height: 300px;
  padding: 16px;
  overflow-y: auto;
`;

const BottomSheet = ( props: BottomSheetProps ) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ penColor, setPenColor ] = useState('#262626');
  const [ penWidth, setPenWidth ] = useState(10);

  const { activeTool, setActiveTool, canvas, textboxRef, textboxProps, isDeco, setTextboxProps } = props;

  useEffect(() => {
    if(!canvas) return;
    
    if(textboxRef.current) {
      setTextboxProps({
        selectedFont: String(textboxRef.current.fontFamily),
        fontWeight: String(textboxRef.current.fontWeight),
        textAlign: String(textboxRef.current.textAlign),
        fontColor: String(textboxRef.current.fill),
      });
    }

    if(canvas.isDrawingMode) {
      canvas.freeDrawingBrush.width = penWidth;
      canvas.freeDrawingBrush.color = penColor;
    }
  }, [activeTool]);

  return (
    <Container style={{ transform: isOpen ? 'translateY(0)' : 'translateY(calc(100% - 130px))' }}>
        <div style={{ textAlign: "center", padding: "8px 0 4px 0" }}>
          {isOpen && (
            <Tab onClick={() => setIsOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="158" height="17" viewBox="0 0 158 17" fill="none">
                <path d="M4 4L79 12.3333L154 4" stroke="#CDCDCD" strokeWidth="7" strokeLinecap="round"/>
              </svg>
            </Tab>
          )}
          {!isOpen && (
            <Tab onClick={() => setIsOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="158" height="17" viewBox="0 0 158 17" fill="none">
                <path d="M4 13L79 4.67L154 13" stroke="#CDCDCD" strokeWidth="7" strokeLinecap="round"/>
              </svg>
            </Tab>
          )}
        </div>
      <Header>
        {!isDeco && (
          <Tab onClick={ () => setActiveTool("textbox") } disabled={ activeTool === "textbox" }>텍스트</Tab>
        )}
        <Tab onClick={ () => setActiveTool("image") } disabled={ activeTool === "image" }>이미지</Tab>
        <Tab onClick={ () => setActiveTool("drawing") } disabled={ activeTool === "drawing" }>그리기</Tab>
        <Tab onClick={ () => setActiveTool('eraser') } disabled={ activeTool === "eraser" }>지우개</Tab>
      </Header>
      <Content>
        {(activeTool === "textbox") && (
          <TextboxContent canvas={ canvas } textboxRef={ textboxRef } textboxProps={ textboxProps } />
        )}
        {(activeTool === "image") && (
          <ImageContent canvas={ canvas } />
        )}
        {(activeTool === "drawing" || activeTool === "eraser") && (
          <DrawingContent canvas={ canvas } penColor={ penColor } setPenColor={ setPenColor } penWidth={ penWidth } setPenWidth={ setPenWidth }/>
        )}
      </Content>
    </Container>
  );
};

export default BottomSheet;

type BottomSheetProps = {
  activeTool: string,
  setActiveTool: React.Dispatch<React.SetStateAction<string>>,
  canvas: fabric.Canvas,
  textboxRef?: React.MutableRefObject<fabric.Textbox>,
  textboxProps?: {
    selectedFont: string;
    fontWeight: string;
    textAlign: string;
    fontColor: string;
  },
  isDeco?: boolean,
  setTextboxProps?: React.Dispatch<React.SetStateAction<{
    selectedFont: string;
    fontWeight: string;
    textAlign: string;
    fontColor: string;
}>>,
}
