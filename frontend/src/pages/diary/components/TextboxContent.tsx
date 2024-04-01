import { useEffect, useState } from 'react';
import { FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatBold } from '@mui/icons-material';
import { Select, MenuItem, InputLabel, ToggleButton, ToggleButtonGroup, Divider } from '@mui/material';
import styled from 'styled-components';

const ContentWrapper = styled.div`
    box-sizing: border-box;
    padding: 20px 40px;
`

const SelectWrapper = styled.div`
    margin-right: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
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
    margin: 25px 20px;
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

const TextboxContent = ( props: ContentProps ) => {
    const fontList = [
        { fontId: 1, fontTitle: "둘기마요체", fontFamily: "Dovemayo" },
        { fontId: 2, fontTitle: "IM혜민체", fontFamily: "IMHyeMin" },
        { fontId: 3, fontTitle: "슈퍼매직체", fontFamily: "Cafe24Supermagic" },
        { fontId: 4, fontTitle: "가을소풍체", fontFamily: "HakgyoansimGaeulsopung" },
    ];

    const colorPalette = [
        "#262626",
        "#F09690",
        "#FFC814",
        "#FFE17D",
        "#BBDED6",
        "#C0DEFF",
        "#BDB5FF",
    ];
    
    const { canvas, textboxRef, textboxProps } = props;
    

    const [ selectedFont, setSelectedFont ] = useState('Dovemayo');
    const [ fontWeight, setFontWeight ] = useState(false);
    const [ textAlign, setTextAlign ] = useState('left');
    const [ fontColor, setFontColor ] = useState('#262626');

    useEffect(() => {
        setSelectedFont(textboxProps?.selectedFont || 'Dovemayo');
        setTextAlign(textboxProps?.textAlign || 'left');
        setFontColor(textboxProps?.fontColor || '#262626');
        setFontWeight(textboxProps?.fontWeight === 'bold' ? true : false);
    }, [textboxProps])

    // 글씨체 변경
    const handleFontChange = (event: any) => {
        canvas.setActiveObject(textboxRef.current);

        const font = event.target.value;
        setSelectedFont(font);

        if (!canvas || !textboxRef.current) return;

        const activeObject: any = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'textbox') {
            activeObject.set("fontFamily", font);
            canvas.renderAll();
        }
    };

    // 글씨 굵기 변경
    const handleFontWeight = () => {
        canvas.setActiveObject(textboxRef.current);
        setFontWeight(!fontWeight);

        if (!canvas || !textboxRef.current) return;
        
        const activeObject: any = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'textbox') {
            activeObject.set('fontWeight', activeObject.get('fontWeight') === 'normal' ? 'bold' : 'normal');
            canvas.renderAll();
        }
    };

    // 글씨 정렬 변경
    const handleTextAlign = (position: string) => {
        canvas.setActiveObject(textboxRef.current);
        setTextAlign(position);

        if (!canvas || !textboxRef.current) return;
        
        const activeObject: any = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'textbox') {
            activeObject.set('textAlign', position);
            canvas.renderAll();
        }
    };

    // 글씨 색 변경
    const handleFontColor = (event: any) => {
        canvas.setActiveObject(textboxRef.current);

        const color = event.target.value;
        setFontColor(color);
        
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'textbox') {
            activeObject.set('fill', color);
            canvas.renderAll();
        }
    };
    
    return (
        <ContentWrapper>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start"}}>
                <SelectWrapper>
                    <InputLabel style={{ fontWeight: "bold", fontSize: "20px", fontFamily: "Dovemayo", margin: "20px" }}>글씨체</InputLabel>
                    <Select
                        value={ selectedFont }
                        onChange={ handleFontChange }
                        sx={{ width: '250px' }}
                        style={{ fontFamily: `${ selectedFont }` }}
                    >
                        {fontList.map((font) => (
                            <MenuItem
                                key={ font.fontId }
                                value={ font.fontFamily }
                                style={{ fontFamily: `${font.fontFamily}` }}
                            >
                                { font.fontTitle }
                            </MenuItem>
                        ))}
                    </Select>
                </SelectWrapper>
                <ToggleButton 
                    value="bold" 
                    size="large"
                    aria-label="bold"
                    selected={ fontWeight }
                    onChange={ handleFontWeight }
                >
                    <FormatBold />
                </ToggleButton>
                <Divider flexItem orientation="vertical" sx={{ mx: 2, my: 1 }} />
                <ToggleButtonGroup
                    value={ textAlign }
                    exclusive
                    onChange={(event, newValue) => {
                        if(newValue !== null) {
                            handleTextAlign(newValue)
                        }
                    }}
                    size="large"
                    aria-label="text alignment"
                    style={{ display: "inline-block" }}
                >
                    <ToggleButton value="left" aria-label="left aligned">
                        <FormatAlignLeft />
                    </ToggleButton>
                    <ToggleButton value="center" aria-label="centered">
                        <FormatAlignCenter />
                    </ToggleButton>
                    <ToggleButton value="right" aria-label="right aligned">
                        <FormatAlignRight />
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <ColorPalette>
                { colorPalette.map((color, index) => (
                    <ColorButton
                        key={index}
                        style={{ backgroundColor: color }}
                        onClick={() => handleFontColor({ target: { value: color } })}
                    />
                ))}
                <ColorPickerContainer>
                    <LabelWrapper htmlFor="color">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 10 10" fill="none">
                            <path d="M9.20404 1.92559L8.07443 0.795986C7.88617 0.607718 7.58204 0.607718 7.39377 0.795986L6.09866 2.0911C5.98194 2.20782 5.79284 2.20832 5.67551 2.0922L5.16807 1.59003C5.05074 1.47391 4.86164 1.4744 4.74492 1.59113L4.48742 1.84863C4.37026 1.96578 4.37026 2.15573 4.48742 2.27289L4.74864 2.53411C4.8658 2.65127 4.8658 2.84122 4.74864 2.95838L0.947648 6.75937C0.760112 6.94691 0.654755 7.20126 0.654755 7.46648V9.04527C0.654755 9.21096 0.789069 9.34527 0.954755 9.34527H2.53355C2.79876 9.34527 3.05312 9.23992 3.24065 9.05238L7.04165 5.25138C7.1588 5.13423 7.34875 5.13423 7.46591 5.25138L7.72713 5.51261C7.84429 5.62976 8.03424 5.62976 8.1514 5.51261L8.4078 5.25621C8.52495 5.13905 8.52495 4.9491 8.4078 4.83195L7.9052 4.32935C7.78805 4.2122 7.78805 4.02225 7.9052 3.90509L9.19921 2.61108C9.39231 2.41799 9.39231 2.11386 9.20404 1.92559ZM2.63495 8.29193C2.57869 8.34819 2.50239 8.3798 2.42282 8.3798H1.92023C1.75454 8.3798 1.62023 8.24548 1.62023 8.0798V7.5772C1.62023 7.49764 1.65184 7.42133 1.7081 7.36507L5.5111 3.56207L6.43795 4.48893L2.63495 8.29193Z" fill="white"/>
                        </svg>
                    </LabelWrapper>
                    <ColorPicker type="color" id="color" value={ fontColor } onChange={ handleFontColor } />
                </ColorPickerContainer>
            </ColorPalette>
        </ContentWrapper>
    )
}
export default TextboxContent;

type ContentProps = {
    canvas: fabric.Canvas,
    textboxRef: React.MutableRefObject<fabric.Textbox>,
    textboxProps?: {
        selectedFont: string;
        fontWeight: string;
        textAlign: string;
        fontColor: string;
    },
}