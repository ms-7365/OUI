package com.emotionoui.oui.music.entity;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "MUSIC")
public class MusicCollection {

    @Id
    @Field("id")
    private ObjectId objectId;

    private List<String> song_gn_dtl_gnr_basket;
    private String issue_date;

    @Field("albumName")
    private String album_name;
    private Integer album_id;
    private List<Integer> artist_id_basket;

    @Field("songName")
    private String song_name;

    private List<String> song_gn_gnr_basket;
    @Field("artistName")
    private List<String> artist_name_basket;
    @Field("musicId")
    private Integer id;

    private List<String> tagName;
    private String youtubeUrl;

    public void setTags(List<String> tagName){
        this.tagName = tagName;
    }

//    public void setSpotifyUrl(String uri){
//        this.spotifyUrl = uri;
//    }

}
