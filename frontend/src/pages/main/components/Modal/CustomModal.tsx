import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { getFIndMember } from "../../api";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CheckCircle from 'src/asset/images/image-icon/checkCircle.png';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import diary1 from 'src/asset/images/diary1.png'
import diary2 from 'src/asset/images/diary2.png'
import diary3 from 'src/asset/images/diary3.png'
import diary4 from 'src/asset/images/diary4.png'
import diary5 from 'src/asset/images/diary5.png'
import searchBtn from 'src/asset/images/image-icon/search.png'
import styled from "styled-components";


const PaperWrapper = styled( Paper )`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%; 
  max-width: 90%; 
  height: 70%; 
  max-height: 90vh; 
  overflow-y: auto; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
  border-radius: 20px;
  background-color: #FFFEFC;
`;

const BoxWrapper = styled( Box )`
  width: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 15px;
  border: 1px solid #ccc; /* 테두리 스타일과 색상을 지정합니다. */
  padding: 10px; /* 테두리와 내용 사이의 간격을 지정합니다. */
  border-radius: 10px
`;

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 95%; 
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

const SearchButton = styled.button`
  width: 35px; 
  height: 30px;
  background-image: url(${searchBtn});
  background-color: white;
  background-size: cover;
  border: none; 
  cursor: pointer; 
  color: transparent; 
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
        <div style={{ display: 'flex', justifyContent: 'center', marginTop:'25px'}}>
            <h1>다이어리 추가</h1>
            <IconButton onClick={ closeModal } sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}>
            <CloseIcon />
            </IconButton>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width:'100%'}}>
            <h2 style={{marginBottom:'8px', marginTop:'30px'}}>제목</h2>
            <div>
              <TextField id="outlined-basic" variant="outlined" value={ title } onChange={ handleTitleChange } 
              InputProps={{
                style: { fontFamily:'Dovemayo', fontSize:'20px', borderRadius: '10px'},
              }}style={{ width:'100%', backgroundColor:'white'}}/>
            </div>
          </div >
          <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width:'100%'}}>
            <h2 style={{marginBottom:'5px', marginTop:'35px'}}>다이어리 표지</h2>
            <BoxWrapper>
              {[diary1, diary2, diary3, diary4, diary5].map(( diaryImage, index ) => (
                <ImageContainer key={ index } onClick={() => handleSelection( index )}
                style={{
                  border: keyImage === index ? '5px solid rgba(248, 224, 197, 0.35)' : 'none' // 선택된 이미지에만 테두리를 추가
                }}>
                  <DiaryImage
                    src={ diaryImage }
                    alt={ `Diary ${ index + 1 }` }
                  />
                  { keyImage === index && (
                    <img src={CheckCircle}
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
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width:'100%'}}>
            <h2 style={{marginBottom:'10px', marginTop:'35px'}}>친구 추가</h2>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width:'100%'}}>
              <TextField id="outlined-basic" variant="outlined" placeholder="이메일을 입력해주세요."
                value={ searchName }
                onChange={ handleInputChange }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <SearchButton onClick={handleSearch} />      
                    </InputAdornment>
                  ),
                style: { borderRadius: '10px', width:'100%', backgroundColor:'white', fontFamily: 'Dovemayo', fontSize:'21.5px'},
              }} />
            </div>
            <div style={{ height:'100px', marginTop:'25px', display: 'flex', flexWrap: 'wrap', alignItems: 'start', gap: '10px' }}>
        {
          memberList.length !== 0 ? 
          memberList.map(( member, index ) => (
              <div key={ index } style={{
                border:'5px solid #F9F3EE',
                backgroundColor:'#F9F3EE',
                borderRadius: '6px', // 둥근 모서리
                boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.1)', // 그림자 효과
                fontSize:'21.5px',
                paddingTop:'8px',
                paddingBottom:'8px',
                paddingLeft:'7px',
                paddingRight:'7px',
                display: 'flex', // 가로로 나열
                alignItems: 'center', // 중앙 정렬
              }}>
                {member}
                <button onClick={() => setMemberList( memberList.filter( e => e !== member ))}
                style={{ marginLeft: '15px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                    X
                </button>
              </div>
            )) 
          : 
          <div></div>
        }
      </div>

            </div>
            


        </ModalContentWrapper>
        <button 
              style={{
                width: '95%', 
                height: '60px', 
                backgroundColor: '#88B3E2',
                color: 'white', // 텍스트 색상을 하얀색으로 지정
                border: 'none', // 테두리 없음
                borderRadius: '10px', // 둥근 모서리
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)', // 그림자 효과
                fontSize:'22px',
                // marginTop:'100px',
              }} 
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
              완  료
            </button>
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