package com.emotionoui.oui.music.dto.req;

import com.emotionoui.oui.music.controller.MusicController;
import com.emotionoui.oui.music.entity.MusicCollection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class SongReq {
    private Integer id;
    private String songName;
    private String albumId;
    private String albumName;
    private List<String> artistIdBasket;
    private List<String> artistNameBasket;
    private List<String> songGnGnrBasket;

//    public MusicCollection toEntity(){
//        return MusicCollection.builder()
//                .musicId(this.id)
//                .songName(this.songName)
//                .albumId(this.albumId)
//                .albumName(this.albumName)
//                .artistId(this.artistIdBasket)
//                .artistName(this.artistNameBasket)
//                .songGnGnr(this.songGnGnrBasket)
//                .build();
//    }
}
