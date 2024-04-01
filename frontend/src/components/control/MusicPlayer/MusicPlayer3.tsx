import { useState, useRef, SetStateAction } from 'react';
import PauseIcon from 'src/asset/images/icon/pause.svg';
import NextIcon from 'src/asset/images/icon/next.svg';
import PrevIcon from 'src/asset/images/icon/prev.svg';
// import RefreshIcon from 'src/asset/images/icon/refresh.svg';
import PlayIcon from 'src/asset/images/icon/play.svg';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

const PlayerWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 1;
  background-color: white;
  border-radius: 20px;
  width: 100%;
  padding: 30px 50px;
  margin-top: 20px;
  margin-bottom: 40px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  line-height: 40px;
`;
const ControlWrapper = styled.div`
  width: 58%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10px;
`;

const Controls = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const Button = styled.button`
  color: #262626;
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

const ProgressWrapper = styled.div`
  width: 100%;
  height: 10px;
  background-color: #CDCDCD;
  border-radius: 60px;
  cursor: pointer;
  margin: 20px;
`;

const ProgressBar = styled.div`
  height: 100%;
  border-radius: 60px;
  background-color: #262626;
`;

const Thumbnail = styled.img`
  width: 35%; 
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
  // const [volume, setVolume] = useState(0.8); 
  const [played, setPlayed] = useState(0);
  const playerRef = useRef( null );

  const togglePlayPause = () => setPlaying( !playing );
  const playPreviousTrack = () => setTrackIndex(( prevIndex ) => ( prevIndex === 0 ? playlist.length - 1 : prevIndex - 1 ));
  const playNextTrack = () => setTrackIndex(( prevIndex ) => ( prevIndex === playlist.length - 1 ? 0 : prevIndex + 1 ));
  // const handleVolumeChange = (e: { target: { value: string; }; }) => setVolume(parseFloat( e.target.value ));
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

  // const onMute = () =>{
  //   if( volume===0 ){
  //       setVolume( 0.5 )
  //   }else{
  //       setVolume( 0 )
  //   }
  // }

  return (
    <PlayerWrapper>
        <Thumbnail src={ getThumbnailUrl( playlist[ trackIndex ])} alt="Video thumbnail" />
        <ControlWrapper>
            <div style={{ width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '40px', fontWeight: 'bold', padding: '10px' }}>Title Title Title</span>
              <span style={{ fontSize: '25px', padding: '10px'  }}>Singer</span>
            </div>
            <ProgressWrapper onClick={ seekTo }>
                <ProgressBar style={{ width: `${played * 100}%` }} />
            </ProgressWrapper>
            <Controls>
                <Button onClick={ playPreviousTrack }><img src={ PrevIcon } alt='prev'/></Button>
                <Button onClick={ togglePlayPause }>
                    {playing ? <img src={ PauseIcon } alt='pause'/> : <img src={ PlayIcon } alt='play'/> }
                </Button>
                <Button onClick={ playNextTrack }> <img src={ NextIcon } alt='next'/></Button>
            </Controls>
        </ControlWrapper>

        <ReactPlayer
        ref={ playerRef }
        url={ playlist[ trackIndex ] }
        playing={ playing }
        onProgress={ handleProgress }
        controls
        style={{ display: 'none'}}
        onEnded={ playNextTrack }
      />
    </PlayerWrapper>
    
  );
};

export default AudioVideoPlayer;