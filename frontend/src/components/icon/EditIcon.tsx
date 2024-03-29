import styled from 'styled-components';

const ButtonWrapper = styled.button<{ size: number}>`
    box-sizing: border-box;
    display: flex;
    width: ${( props ) => props.size }px;
    border: none;
    cursor: pointer;
    background-color: transparent;
`

const EditIcon = ( props: IconProps ) => {
    const { size, onClick } = props;

    return (
        <ButtonWrapper size={ size } onClick={ onClick }>
            <svg xmlns="http://www.w3.org/2000/svg" width="53" height="52" viewBox="0 0 53 52" fill="none">
                <path d="M4.88235 38.7059L2.82436 46.7699C2.45098 48.2329 3.7714 49.5662 5.23798 49.207L13.5294 47.1765L49.5415 11.8993C50.3421 11.1151 50.3421 9.82612 49.5415 9.04187L43.7525 3.371C42.9749 2.60929 41.731 2.60928 40.9534 3.371L4.88235 38.7059Z" stroke="#292929" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M35 11L42 18" stroke="#292929" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M28 50H51" stroke="#292929" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </ButtonWrapper>
    )
}

export default EditIcon;

type IconProps = {
    size?: number,
    onClick?: () => void,
}