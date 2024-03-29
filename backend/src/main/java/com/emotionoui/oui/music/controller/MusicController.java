package com.emotionoui.oui.music.controller;

import com.emotionoui.oui.music.dto.req.SongReq;
import com.emotionoui.oui.music.service.MusicService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import se.michaelthelin.spotify.SpotifyApi;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/music")
@Slf4j
public class MusicController {

    private final MusicService musicService;
    private final String success = "success";

//    @PostMapping("/upload")
//    public String uploadSong(@RequestBody List<SongReq> req){
//        musicService.uploadSongMeta(req);
//        return success;
//    }

    @PostMapping("/uploadSong")
    public String uploadSong() throws IOException {
        musicService.uploadSong();
        return success;
    }

    // 유투브 링크 가져오기 테스트 (Postman용)
    @GetMapping("/searchYoutube/{songName}/{artistName}")
    public String searchUrl(@PathVariable("songName") String songName, @PathVariable("artistName") String artistName) throws IOException {
        return musicService.searchYoutube(songName, artistName);
    }
}
