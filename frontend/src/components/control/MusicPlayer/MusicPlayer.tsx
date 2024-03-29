import AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';


const MusicPlayer = () => {


    return(
        <AudioPlayer
        style={
        {
            width: '30%',
            height: '10%'
        }
        }
        autoPlay
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
        onPlay={e => console.log("onPlay")}
            // other props here
        />
    )
}
export default MusicPlayer;