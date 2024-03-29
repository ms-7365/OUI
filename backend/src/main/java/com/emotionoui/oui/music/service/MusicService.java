package com.emotionoui.oui.music.service;

import com.emotionoui.oui.music.dto.req.SongReq;

import java.io.IOException;
import java.util.List;

public interface MusicService {

//    void uploadSongMeta(List<SongReq> songList);
//    String searchMusicURI(String artistName, String songName);
    void uploadSong() throws IOException;
    String searchYoutube(String songName, String artistName) throws IOException;
}
