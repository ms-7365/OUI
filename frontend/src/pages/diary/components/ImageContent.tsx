import { useState } from 'react';
import { fabric } from 'fabric';
import { FileUploadOutlined } from '@mui/icons-material';
import JoyIcon from 'src/asset/images/emotion-icon/joyIcon.png';
import ComfortIcon from 'src/asset/images/emotion-icon/comfortIcon.png';
import PanicIcon from 'src/asset/images/emotion-icon/panicIcon.png';
import AngryIcon from 'src/asset/images/emotion-icon/angryIcon.png';
import UnrestIcon from 'src/asset/images/emotion-icon/unrestIcon.png';
import SadIcon from 'src/asset/images/emotion-icon/sadnessIcon.png';
import styled from 'styled-components';

const ContentWrapper = styled.div`
  box-sizing: border-box;
  padding: 10px 60px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20%, auto));
  row-gap: 10px;
  justify-content: center;
  align-items: center;
`

const UploadLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 130px;
  height: 130px;
  border: 2px dashed gray;
  border-radius: 10px;
  margin: 13px;
`

const ButtonWrapper = styled.button`
    box-sizing: border-box;
    display: flex;
    width: 100px;
    padding: 0px;
    margin: 10px;
    border: none;
    cursor: pointer;
    background-color: transparent;
`

const ImageContent = ( props: ContentProps ) => {
  const { canvas } = props;
  
  // 이미지 파일 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
          const imgElement = document.createElement('img');
          imgElement.src = event.target.result as string;
          imgElement.onload = () => {
              const maxWidth = 150;
              const scaleFactor = maxWidth / imgElement.width; 

              const imgInstance = new fabric.Image(imgElement, {
                  left: 300,
                  top: 300,
                  scaleX: scaleFactor,
                  scaleY: scaleFactor,
                  angle: 0,
                  opacity: 1.0,
              });
              canvas.add(imgInstance);
              canvas.setActiveObject(imgInstance);
          };
      };
      reader.readAsDataURL(file);
      }
  };

// 스티커 추가
const handleSticker = (value: string) => {
    const imgElement = document.createElement('img');
    imgElement.src = value;
    imgElement.onload = () => {
        const maxWidth = 150;
        const scaleFactor = maxWidth / imgElement.width; 

        const imgInstance = new fabric.Image(imgElement, {
            left: 300,
            top: 300,
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            angle: 0,
            opacity: 1.0,
        });
        canvas.add(imgInstance);
        canvas.setActiveObject(imgInstance);
    };
}
      
  const stickerList = [ JoyIcon, ComfortIcon, PanicIcon, AngryIcon, UnrestIcon, SadIcon ];

  return (
    <ContentWrapper>
      <UploadLabel htmlFor="upload">
        <FileUploadOutlined fontSize='large' />
      </UploadLabel>
      <input id="upload" style={{ display: "none" }} type="file" accept="image/*" onChange={ handleImageUpload } />
      { stickerList.map( ( sticker, index ) => (
        <ButtonWrapper key={ index } onClick={ () => handleSticker(sticker) }>
          <img src={ sticker } alt="emoji" style={{ height: "130px" }}/>
        </ButtonWrapper>
      ))}
    </ContentWrapper>
  )
}

export default ImageContent;

type ContentProps = {
  canvas: fabric.Canvas,
}