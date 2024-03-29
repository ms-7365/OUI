import Button from 'src/components/control/Button/Button';
import { Drawer } from 'src/components/control/Drawer';
import { Header } from 'src/components/control/Header';
import { BottomNavi } from 'src/components/control/BottomNavi';
import axios from 'axios';
import { MusicPlayer, MusicPlayer2 } from 'src/components/control/MusicPlayer';
import styled from 'styled-components'
import { NotificationModal } from 'src/components/control/NotificationModal';

const MyPage = () => {
    console.log(axios.defaults.headers.common["Authorization"])

    return(
        <>
            <Drawer/>
            <MusicPlayer></MusicPlayer>
            <MusicPlayer2></MusicPlayer2>
            <BottomNavi/>
            <div>
                <h1>MyPage</h1>
            </div>
        </>
    );
}
export default MyPage;