//package com.emotionoui.oui.music;
//
//import com.emotionoui.oui.music.dto.req.SongReq;
//import com.emotionoui.oui.music.entity.MusicCollection;
//import com.emotionoui.oui.music.repository.MusicMongoRepository;
//import com.emotionoui.oui.music.service.MusicServiceImpl;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.Disabled;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
//import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.HttpMethod;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.test.context.TestPropertySource;
//import org.springframework.web.client.RestTemplate;
//import se.michaelthelin.spotify.SpotifyApi;
//
//import java.util.ArrayList;
//import java.util.List;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.startsWith;
//import static org.mockito.Mockito.when;
//
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
//public class MusicServiceTest {
//
//    @Autowired
//    private MusicMongoRepository musicMongoRepository;
//
//
//    @Autowired
//    private MusicServiceImpl musicService;
//
//    @DisplayName("MongoDB에 노래를 저장한다.")
//    @Test
//    void saveSongMeta() throws Exception{
//       List<SongReq> songList = List.of(
//               SongReq.builder()
//                       .id(-1)
//                       .songName("반대로냥")
//                       .artistNameBasket(List.of("이츠허밍"))
//                       .build(),
//
//               SongReq.builder()
//                       .id(-2)
//                       .songName("Gotta Let Go")
//                       .artistNameBasket(List.of("Hypanda", "IA"))
//                       .build()
//       );
//
//
//       musicService.uploadSongMeta(songList);
//       MusicCollection mc1 = musicMongoRepository.findByMusicId(-1);
//       assertThat(mc1.getSongName()).isEqualTo(songList.get(0).getSongName());
//
//       MusicCollection mc2 = musicMongoRepository.findByMusicId(-2);
//       for(int i=0; i<mc2.getArtistName().size(); ++i){
//           assertThat(mc2.getArtistName().get(i)).isEqualTo(songList.get(1).getArtistNameBasket().get(i));
//       }
//
//       musicMongoRepository.delete(mc1);
//       musicMongoRepository.delete(mc2);
//    }
//
//
//    @DisplayName("노래명, 가수명으로 Spotify URI를 반환한다.")
//    @Test
//    void getSpotifyURI() throws Exception{
//        String uri = musicService.searchMusicURI("임창정", "소주 한 잔");
//        assertEquals("spotify:track:10if3nqm7OS7qrV45v9GOg", uri);
//    }
//}
