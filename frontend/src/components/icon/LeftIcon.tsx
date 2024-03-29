
import styled from 'styled-components'
import leftButton from 'src/asset/images/image-icon/left-btn.png'

const ButttonWrapper = styled.button<{ size : number }>`
    box-sizing: border-box;
    display: flex;
    width: ${( props ) => props.size }px;
    padding: 0px;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: transparent;
`

const LeftIcon = ( props: IconProps ) => {

    const { size = 40, onClick } = props

    return(
        <ButttonWrapper size={ size } onClick={ onClick }>
           <img width={ size } height={ size } src={leftButton} alt="leftButton"/>
        </ButttonWrapper>
    )
}

export default LeftIcon

type IconProps = {
    size?: number,
    onClick?: () => void,
}