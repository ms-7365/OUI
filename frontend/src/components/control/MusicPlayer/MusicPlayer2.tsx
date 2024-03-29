import { useState, useRef, SetStateAction } from 'react';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

const PlayerWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  line-height: 1;
  width: 30%;
  padding: 10px 15px;
  background-color: #fff;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.2);
`;
const ControlWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const Button = styled.button`
  color: #868686;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  &:focus {
    outline: none;
  }
  &:hover {
    opacity: 0.8;
  }
`;
const Icon = styled.span`
  .MuiSvgIcon-root { 
    font-size: 25px; 
  }
`;

const VolumeControlWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const VolumeSlider = styled.input`
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 100%;
    height: 8px;
    margin-left: 0px;  
    appearance: none;
    background: #ddd; 
    &::-webkit-slider-thumb {
    appearance: none;
    width: 15px; 
    height: 15px; 
    background: #868686; 
    cursor: pointer;
    border-radius: 50%; 
    }
`;
const ProgressWrapper = styled.div`
  width: 80%;
  height: 4px;
  background-color: #ddd;
  cursor: pointer;
  margin-top: 10px;
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: #868686;
`;

const Thumbnail = styled.img`
  width: 100px; 
  height: auto;
  border-radius: 4px;
  margin-right: 5px; 
`;


const playlist = [
    'https://www.youtube.com/watch?v=xzsRBKZh1No',
    'https://www.youtube.com/watch?v=yL6P7OR5WOM',
    'https://www.youtube.com/watch?v=Hfep-HihqZo',
    'https://www.youtube.com/watch?v=k3-BDy55tq4'
  ];

const getThumbnailUrl = ( url:string ) => {
    const videoId = url.split('v=')[1];
    return `https://img.youtube.com/vi/${ videoId }/default.jpg`;
  }
  

const AudioVideoPlayer = () => {
  const [playing, setPlaying] = useState( false );
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.8); 
  const [played, setPlayed] = useState(0);
  const playerRef = useRef( null );

  const togglePlayPause = () => setPlaying( !playing );
  const playPreviousTrack = () => setTrackIndex(( prevIndex ) => ( prevIndex === 0 ? playlist.length - 1 : prevIndex - 1 ));
  const playNextTrack = () => setTrackIndex(( prevIndex ) => ( prevIndex === playlist.length - 1 ? 0 : prevIndex + 1 ));
  const handleVolumeChange = (e: { target: { value: string; }; }) => setVolume(parseFloat( e.target.value ));
  const handleProgress = ( state: { played: SetStateAction<number>; }) => {
    setPlayed( state.played );
  };

  const seekTo = ( e ) => {
    const progressContainerRect = e.currentTarget.getBoundingClientRect();
    const clickPosition = ( e.clientX - progressContainerRect.left ) / progressContainerRect.width;
    const seekTime = playerRef.current.getDuration() * clickPosition;
    playerRef.current.seekTo( seekTime, 'seconds' );
    setPlayed( clickPosition );
  };

  const onMute = () =>{
    if( volume===0 ){
        setVolume( 0.5 )
    }else{
        setVolume( 0 )
    }
  }

  return (
    <PlayerWrapper>
        <Thumbnail src={ getThumbnailUrl( playlist[ trackIndex ])} alt="Video thumbnail" />
        <ControlWrapper>
            <ProgressWrapper onClick={ seekTo }>
                <ProgressBar style={{ width: `${played * 100}%` }} />
            </ProgressWrapper>
            <Controls>

                <Button onClick={ playPreviousTrack }><Icon><FastRewindIcon/></Icon></Button>
                <Button onClick={ togglePlayPause }>
                    {playing ? <Icon><PauseCircleIcon/></Icon> : <Icon><PlayCircleIcon/></Icon> }
                </Button>
                <Button onClick={ playNextTrack }> <Icon><FastForwardIcon/></Icon></Button>
                <VolumeControlWrapper>
                    <Button style={{ margin:'0px', padding: '0px' }} 
                        onClick= { onMute }>{ volume === 0 ? <Icon><VolumeOffIcon/></Icon> : <Icon><VolumeUpIcon/></Icon>}
                    </Button>
                    <VolumeSlider
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={ volume }
                        onChange={ handleVolumeChange }/>
                </VolumeControlWrapper>
            </Controls>
        </ControlWrapper>

        <ReactPlayer
        ref={ playerRef }
        url={ playlist[ trackIndex ] }
        playing={ playing }
        volume={ volume }
        onProgress={ handleProgress }
        controls
        style={{ display: 'none'}}
        onEnded={ playNextTrack }
      />
    </PlayerWrapper>
    
  );
};

export default AudioVideoPlayer;