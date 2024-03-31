import diary1 from 'src/asset/images/diary1.png';
import diary2 from 'src/asset/images/diary2.png';
import diary3 from 'src/asset/images/diary3.png';
import diary4 from 'src/asset/images/diary4.png';
import diary5 from 'src/asset/images/diary5.png';
import styled from 'styled-components';

const CardWrapper = styled.div<CardWrapperProps>`
  display: flex;
  position: relative;  
  align-items: center;
  justify-content: center; 
  padding: 20px;
  margin: 10px;
  max-width: 700px;
  width: 30vh;
  height: 60vh;
  background-size: 100% 100%;
  background-image: ${(props) => props.$templateId !== undefined 
    && props.$templateId !== -1 && getImageUrl(props.$templateId) ? `url(${getImageUrl(props.$templateId)})` : 'none'};
  border: ${( props ) => props.$templateId === -1 ? '6px dashed black' : props.$templateId ? '3px solid white' : 'none'};
  border-radius: ${( props ) => props.$templateId ? '8px' : '0'};
  box-shadow: ${( props ) => ( props.$templateId && props.$templateId !== -1 ) ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none'};
  ${( props ) => props.$templateId === -1 && `
    &::after {
      content: '+';
      font-size: 48px;
      color: black;
    }
  `}
`;

const CardButton = styled.button`
  position: absolute;
  bottom: 10px;
  left: 10px; 
  background-color: transparent;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
`;

const CardTitle = styled.div`
  position: absolute;
  top: 60px; // 상단 마진 조절
  left: 50%; // 가운데 정렬을 위해 왼쪽에서 50% 위치
  transform: translateX(-50%); // 정확한 가운데 정렬을 위해 자신의 너비의 50%만큼 왼쪽으로 이동
  width: 90%; // 박스 너비에 맞춰 조절
  color: white;
  font-size: clamp(50px, 2.5vw, 70px); // 뷰포트 너비에 따라 글자 크기 동적 조절
  text-align: center; // 텍스트 가운데 정렬
  white-space: nowrap; // 텍스트를 한 줄로 유지
  overflow: hidden; // 넘치는 텍스트 숨김
  text-overflow: ellipsis; // 넘치는 텍스트를 ...으로 표시
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
`;

const getImageUrl = ( templateId: number ) => {
  switch ( templateId ) {
    case 0: return diary1;
    case 1: return diary2;
    case 2: return diary3;
    case 3: return diary4;
    case 4: return diary5;
    default: return null;
  }
}

const Card = ({ buttonText, onClick, templateId, title }: CardProps ) => {

  const date = buttonText;

  return (
    <CardWrapper onClick={ onClick } $templateId={ templateId }>
      {title && <CardTitle>{title}</CardTitle>}
      {date && <CardButton>{date}</CardButton>}
    </CardWrapper>
  );
};

type CardProps = {
  buttonText?: string;
  onClick?: () => void;
  templateId?: number;
  title?: string;
}

type CardWrapperProps = {
  $templateId?: number;
};



export default Card;