import styled from 'styled-components'
import rightButton from 'src/asset/images/image-icon/right-btn.png'

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

const RightIcon = ( props: IconProps ) => {

    const { size = 40, onClick } = props

    return(
        <ButttonWrapper size={ size } onClick={ onClick }>
          <img width={ size } height={ size } src={rightButton} alt="rightButton"/>
        </ButttonWrapper>
    )
}

export default RightIcon

type IconProps = {
    size?: number,
    onClick?: () => void,
}