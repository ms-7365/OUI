import { useState } from "react";
import { Box } from "@mui/material";
import styled from "styled-components";

type ButtonWrapperProps = {
    selected?: boolean;
}

const BoxWrapper = styled(Box)`
    border-radius: 4px;
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
    align-items: center;
    width: auto; 
    padding: 5px; 
    max-width: 800px;
`;

const ButtonWrapper = styled.button<ButtonWrapperProps>`
    background-color: ${(props) => (props.selected ? "#84BBAF" : "white")};
    color: ${(props) => (props.selected ? "white" : "#84BBAF")};
    border: 0px;
    padding: 10px; 
    margin: 3px;
    cursor: pointer;
    font-family: 'IMHyeMin';
    font-weight: bold;
`;

const Switch = ({ keyType, setKeyType }) => {
    
    return (
        <BoxWrapper>
            <ButtonWrapper onClick={() => setKeyType(1)} selected={keyType === 1}>
                월간
            </ButtonWrapper>
            <ButtonWrapper onClick={() => setKeyType(2)} selected={keyType === 2}>
                주간
            </ButtonWrapper>
        </BoxWrapper>
    );
}

export default Switch;
