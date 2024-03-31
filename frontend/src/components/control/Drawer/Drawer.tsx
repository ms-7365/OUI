import * as React from 'react';
import { Button } from '../Button';
import {
  Box,
  SwipeableDrawer as Bottom, 
  List,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import useStore from 'src/store'
import styled from 'styled-components';

const BottomWrapper = styled( Bottom )`
    max-width: 1024px;
    width: 100%;
    display: flex;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
` 

const TitleWrapper = styled.div`
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px; 
  text-align: center; 
`;

const Drawer = () => {
    const [ open, setOpen ] = React.useState( false );
    const navigator = useNavigate()
    const { diaryId, dailyDiaryId, type } = useStore()
    const toggleDrawer = ( newOpen: boolean ) => () => {
      setOpen( newOpen );
    };

    const goWriteDiary = () => {
      navigator(`/diary/write/${ diaryId }`)
    }

    const goCalendar = () => {
      type === '개인' &&
      navigator('/calendar') 
      type === '공유' && 
      navigator(`/calendar/${ diaryId }`)
    }

    const goAnalysis = () => {
      type === '개인' &&
      navigator('/analysis') 
      type === '공유' && 
      navigator(`/shareanalysis`)
    }
  
    const DrawerList = (
      <Box sx={{ maxWidth: '1024px' }} role="presentation">
        <TitleWrapper>My Diary</TitleWrapper>
        <Divider />
        <List>
        {/* 오늘의 일기 */}
          <ListItemButton onClick={ goWriteDiary }>
            <ListItemIcon><AutoStoriesOutlinedIcon/></ListItemIcon>
            <ListItemText primary='오늘의 일기' />
          </ListItemButton>
          <ListItemButton onClick={ goCalendar }>
            <ListItemIcon><CalendarTodayOutlinedIcon/></ListItemIcon>
            <ListItemText primary='캘린더' />
          </ListItemButton>
          <ListItemButton onClick={ goAnalysis }>
            <ListItemIcon><ShowChartIcon/></ListItemIcon>
            <ListItemText primary='감정 통계' />
          </ListItemButton>
          {/* 설정 페이지 생기면 라우팅 */}
          <ListItemButton>
            <ListItemIcon><SettingsOutlinedIcon/></ListItemIcon>
            <ListItemText primary='설정' />
          </ListItemButton>
        </List>
      </Box>
    );
    
    return(
        <div>
          <Button btType='hamburger' name="temp"  onButtonClick={ toggleDrawer(true) } ></Button>
          <BottomWrapper anchor={'bottom'} open={open} onClose={ toggleDrawer(false) } onOpen={toggleDrawer( true )} >
            <IconButton onClick={ toggleDrawer(false) } sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }} >
              <CloseIcon /> 
            </IconButton>
                { DrawerList }
          </BottomWrapper>
        </div>   
    );

}
export default Drawer;