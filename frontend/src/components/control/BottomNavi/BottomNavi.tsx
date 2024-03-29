import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MainLogo from 'src/asset/images/image-icon/logo.png';
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components';

const BottomNaviWrapper = styled( BottomNavigation )`
    background-color: white;
    display: flex;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    max-width: 1024px;
    width: 100%;

`;

export default function BottomNavi() {
  const [ value, setValue ] = React.useState(0);
  const navigator = useNavigate()

  const goMain = () => {
    navigator('/main')
  }

  return (
    <>
    <BottomNaviWrapper
      showLabels
      value={ value }
      onChange={( event, newValue ) => {
        setValue( newValue );
      }}
    >
      <BottomNavigationAction  icon={<PersonOutlineOutlinedIcon />} />
      <BottomNavigationAction icon={<img src={ MainLogo } style={{ width: 24, height: 24 }}/>} onClick={ goMain } />
      {/*  알람 띄우는 거 집가서 */}
      <BottomNavigationAction  icon={<NotificationsNoneOutlinedIcon />} />
    </BottomNaviWrapper>
    </>

  );
}