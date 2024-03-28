import { useState } from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';

const ContentWrapper = styled.div`
  box-sizing: border-box;
  padding: 20px 60px;
`

const ColorPickerContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const LabelWrapper = styled.label`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
`;

const ColorPalette = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 15px 0;
`;

const PenWidth = styled.div`
  margin: 5px 0;
`;

const ColorButton = styled.button`
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border: none;
  cursor: pointer;
  border-radius: 10px;
`;

const ColorPicker = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 60px;
  height: 60px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  &::-webkit-color-swatch {
      border-radius: 10px;
      border: none;
  }
  &::-moz-color-swatch {
      border-radius: 10px;
      border: none;
  }
`

const PrettoSlider = styled(Slider)({
  color: '#262626',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&::before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#262626',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&::before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

const DrawingContent = ( props: ContentProps ) => {
  const colorPalette = [
    "#262626",
    "#F09690",
    "#FFC814",
    "#FFE17D",
    "#BBDED6",
    "#C0DEFF",
    "#BDB5FF",
  ];
  
  const { canvas, penColor, setPenColor, penWidth, setPenWidth } = props;

  // 펜 굵기
  const handlePenWidth = (event: any) => {
    const width = event.target.value;
    setPenWidth(parseInt(width, 10) || 1);

    if(!canvas) return;

    const pen = canvas.freeDrawingBrush;
    pen.width = width;
    canvas.renderAll();
  }

  // 펜 색상
  const handlePenColor = (event: any) => {
    const color = event.target.value;
    setPenColor(color);

    if(!canvas) return;

    const pen = canvas.freeDrawingBrush;
    pen.color = color;
    canvas.renderAll();
  } 

  return (
    <ContentWrapper>
      <PenWidth>
        <Typography gutterBottom>펜 굵기</Typography>
        <PrettoSlider
          valueLabelDisplay="auto"
          aria-label="pretto slider"
          min={1}
          max={30}
          value={ penWidth } 
          onChange={ handlePenWidth }
        />
      </PenWidth>
      <ColorPalette>
        <Typography gutterBottom style={{ marginRight: "30px" }}>펜 색깔</Typography>
        { colorPalette.map((color, index) => (
          <ColorButton
              key={index}
              style={{ backgroundColor: color }}
              onClick={() => handlePenColor({ target: { value: color } })}
          />
        ))}
        <ColorPickerContainer>
          <LabelWrapper htmlFor="color">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 10 10" fill="none">
                <path d="M9.20404 1.92559L8.07443 0.795986C7.88617 0.607718 7.58204 0.607718 7.39377 0.795986L6.09866 2.0911C5.98194 2.20782 5.79284 2.20832 5.67551 2.0922L5.16807 1.59003C5.05074 1.47391 4.86164 1.4744 4.74492 1.59113L4.48742 1.84863C4.37026 1.96578 4.37026 2.15573 4.48742 2.27289L4.74864 2.53411C4.8658 2.65127 4.8658 2.84122 4.74864 2.95838L0.947648 6.75937C0.760112 6.94691 0.654755 7.20126 0.654755 7.46648V9.04527C0.654755 9.21096 0.789069 9.34527 0.954755 9.34527H2.53355C2.79876 9.34527 3.05312 9.23992 3.24065 9.05238L7.04165 5.25138C7.1588 5.13423 7.34875 5.13423 7.46591 5.25138L7.72713 5.51261C7.84429 5.62976 8.03424 5.62976 8.1514 5.51261L8.4078 5.25621C8.52495 5.13905 8.52495 4.9491 8.4078 4.83195L7.9052 4.32935C7.78805 4.2122 7.78805 4.02225 7.9052 3.90509L9.19921 2.61108C9.39231 2.41799 9.39231 2.11386 9.20404 1.92559ZM2.63495 8.29193C2.57869 8.34819 2.50239 8.3798 2.42282 8.3798H1.92023C1.75454 8.3798 1.62023 8.24548 1.62023 8.0798V7.5772C1.62023 7.49764 1.65184 7.42133 1.7081 7.36507L5.5111 3.56207L6.43795 4.48893L2.63495 8.29193Z" fill="white"/>
            </svg>
          </LabelWrapper>
          <ColorPicker type="color" id="color" value={ penColor } onChange={ handlePenColor } />
        </ColorPickerContainer>
      </ColorPalette>
    </ContentWrapper>

    
  )
}

export default DrawingContent;

type ContentProps = {
  canvas: fabric.Canvas,
  penColor: string,
  setPenColor: React.Dispatch<React.SetStateAction<string>>,
  penWidth: number,
  setPenWidth: React.Dispatch<React.SetStateAction<number>>,
}