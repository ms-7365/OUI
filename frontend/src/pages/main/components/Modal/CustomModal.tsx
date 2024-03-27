import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { getFIndMember } from "../../api";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import diary1 from 'src/asset/images/diary1.png'
import diary2 from 'src/asset/images/diary2.png'
import diary3 from 'src/asset/images/diary3.png'
import diary4 from 'src/asset/images/diary4.png'
import styled from "styled-components";


const PaperWrapper = styled( Paper )`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto; 
  max-width: 90%; 
  height: auto; 
  max-height: 90vh; 
  overflow-y: auto; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 20px;
`;

const BoxWrapper = styled( Box )`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
`;

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%; 
`;

const DiaryImage = styled.img`
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
  width: 100%; 
  height: auto; 

  @media (max-width: 768px) {
    // 태블릿 크기
    width: 100%;
  }

  @media (max-width: 480px) {
    // 모바일 크기
    width: 100%;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  flex-basis: calc(25% - 40px); 
  height: auto;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    flex-basis: calc(50% - 40px);
  }

  @media (max-width: 480px) {
    flex-basis: 100%;
  }
`;


const CustomModal = ( props:ModalProps ) => {

  const { isOpen, closeModal, isFinish } = props
  const [ keyImage, setSelectedImage ] = useState( -1 );
  const [ searchName, setSearchName ] = useState( '' );
  const [ title, setTitle ] = useState( '' );
  const [ memberList, setMemberList ] = useState([ ]);

  const handleInputChange = ( event ) => {  // 친구 이름 칸
    setSearchName( event.target.value ); 
  };

  const handleTitleChange = ( event ) => { // 다이어리 제목
    setTitle( event.target.value );
  };

  const handleSelection = ( index ) => {  // 이미지 선택
    if( keyImage === index ){
      setSelectedImage( null );
    }else{
      setSelectedImage( index );
    }
  };

  const handleSearch = () => {  //친구 검색 함수 필요
    if( searchName !== '' ) {
      const input = { memberEmail: searchName };
      getFIndMember(searchName)
      .then(( res ) => {
        console.log( res )
          if( res !== undefined ){
            if (!memberList.includes( searchName )) {
              setMemberList([
                ...memberList,
                searchName
              ]);
            }
          }
          else{
            alert("검색 결과 없음")
          }
          setSearchName('')
      })  
      .catch(( err ) => {
        console.error( 'Error:', err );
      });
    } 
  };


  useEffect(() => {
    console.log(memberList);
    if ( isOpen ) {
      setSelectedImage( -1 );
      setSearchName( '' );
      setTitle( '' );
      setMemberList([ ]);
    }
  }, [ isOpen ]); 


  return (
    <Modal open={ isOpen } onClose={ closeModal }>
      <PaperWrapper>
        <ModalContentWrapper>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
            <h2>다이어리 추가</h2>
            <IconButton onClick={ closeModal } sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}>
            <CloseIcon />
            </IconButton>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <h3>제목</h3>
            <div>
              <TextField id="outlined-basic" variant="outlined" value={ title } onChange={ handleTitleChange }/>
            </div>
          </div>
            <h3>다이어리 표지</h3>
            <BoxWrapper>
              {[diary1, diary2, diary3, diary4].map(( diaryImage, index ) => (
                <ImageContainer key={ index } onClick={() => handleSelection( index )}>
                  <DiaryImage
                    src={ diaryImage }
                    alt={ `Diary ${ index + 1 }` }
                  />
                  { keyImage === index && (
                    <CheckCircleIcon
                      style={{
                        position: 'absolute',
                        color: 'green',
                        fontSize: '48px',
                      }}
                    />
                  )}
                </ImageContainer>
              ))}
            </BoxWrapper>
            <h3>친구 추가</h3>
            <div>
              <TextField id="outlined-basic" variant="outlined"
                value={ searchName }
                onChange={ handleInputChange }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <button onClick={ handleSearch }>검색</button>
                    </InputAdornment>
                  ),
              }}
              />
              {
                  memberList.length !== 0 ? 
                  memberList.map(( member, index ) => (
                    <div key={ index }>
                      {member}
                      <button onClick={() => setMemberList( memberList.filter( e => e !== member ))}>
                        빼기
                      </button>
                    </div>
                  )) 
                  : 
                  <div>ho</div>
              }
              </div>
            <button 
              onClick={() => {
                if ( title !== '' && keyImage !== -1 ) {
                  isFinish({ title:title, key: keyImage, members: memberList });
                } else {
                  if( title === '' ){
                    alert( "제목" );
                  }
                  else if( keyImage ===-1 ){
                    alert( "템플릿" );
                  }    
                }
              }}
            >
              완료
            </button>

        </ModalContentWrapper>
      </PaperWrapper>
    </Modal>
  );
}

type ModalProps = {
  isOpen? : boolean;
  closeModal?: () => void;
  isFinish?: ( props: addProps ) => void;
}

type addProps = {
  title?: string;
  key?: number;
  members?: String[];
}


export default CustomModal;