import diary1 from 'src/asset/images/diary1.png';
import diary2 from 'src/asset/images/diary2.png';
import diary3 from 'src/asset/images/diary3.png';
import diary4 from 'src/asset/images/diary4.png';
import styled from 'styled-components';

const CardWrapper = styled.div< CardWrapperProps >`
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
  background-image: ${( props ) => ( props.templateId !== undefined 
    && props.templateId !== -1 && getImageUrl( props.templateId )) ? `url(${ getImageUrl( props.templateId ) })` : 'none'};
  border: ${( props ) => props.templateId === -1 ? '6px dashed black' : props.templateId ? '3px solid white' : 'none'};
  border-radius: ${( props ) => props.templateId ? '8px' : '0'};
  box-shadow: ${( props ) => ( props.templateId && props.templateId !== -1 ) ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none'};
  ${( props ) => props.templateId === -1 && `
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

const getImageUrl = ( templateId: number ) => {
  switch ( templateId ) {
    case 0: return diary1;
    case 1: return diary2;
    case 2: return diary3;
    case 3: return diary4;
    default: return null;
  }
}

const Card = ({ buttonText, onClick, templateId }: CardProps ) => {

  const date = buttonText;

  return (
    <CardWrapper onClick={ onClick } templateId={ templateId }>
      {date && <CardButton>{ date }</CardButton>}
    </CardWrapper>
  );
};

type CardProps = {
  buttonText?: string;
  onClick?: () => void;
  templateId?: number;
}

type CardWrapperProps = {
  templateId?: number;
};



export default Card;