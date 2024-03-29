import { styled } from 'styled-components';

const ButtonWrapper = styled.button<{ size: number}>`
    box-sizing: border-box;
    display: flex;
    width: ${( props ) => props.size }px;
    border: none;
    cursor: pointer;
    background-color: transparent;
`

const BackIcon = ( props: IconProps ) => {
    const { size , onClick } = props;

    return (
        <ButtonWrapper size={ size } onClick={ onClick }>
            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="46" viewBox="0 0 45 46" fill="none">
                <rect width="29.2566" height="5" rx="2.75" transform="matrix(0.651531 -0.758622 0.643764 0.765224 0.330078 22.4141)" fill="#262626"/>
                <rect width="29.2895" height="5" rx="2.75" transform="matrix(0.646303 0.763081 -0.649001 0.760787 4.27344 19.2451)" fill="#262626"/>
                <rect x="4.66992" y="19.7207" width="40" height="5" rx="2.75" fill="#262626"/>
            </svg>
        </ButtonWrapper>
    )
}

export default BackIcon;

type IconProps = {
    size?: number,
    onClick?: () => void,
}