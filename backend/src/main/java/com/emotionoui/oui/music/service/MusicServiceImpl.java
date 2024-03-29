package com.emotionoui.oui.music.service;

import com.emotionoui.oui.common.exception.MusicException;
import com.emotionoui.oui.music.dto.req.SongReq;
import com.emotionoui.oui.music.dto.res.SongRes;
import com.emotionoui.oui.music.entity.MusicCollection;
import com.emotionoui.oui.music.repository.MusicMongoRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import se.michaelthelin.spotify.SpotifyApi;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class MusicServiceImpl implements MusicService{


    private final SpotifyApi spotifyApi;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Qualifier("englishFinderPattern")
    private final Pattern englishFinderPattern;

    @Qualifier("artistNameFilterPattern")
    private final Pattern artistNameFilterPattern;

    // 본인의 YouTube Data API 키로 대체
    @Value("${YOUTUBE_API_KEY}")
    private String API_KEY;

    private final int RESPONSE_NUM = 5;
    private final String SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search?locale=ko-KR,ko&type=track&market=KR&limit=5&offset=0&q=";
    private final String ITUNES_SEARCH_URL = "https://itunes.apple.com/search?limit=1&media=music&term=";

    private final MusicMongoRepository musicMongoRepository;

    public String searchYoutube(String songName, String artistName) throws IOException {

        // JSON 데이터를 처리하기 위한 JsonFactory 객체 생성
        JsonFactory jsonFactory = new JacksonFactory();

        // YouTube 객체를 빌드하여 API에 접근할 수 있는 YouTube 클라이언트 생성
        YouTube youtube = new YouTube.Builder(
                new com.google.api.client.http.javanet.NetHttpTransport(),
                jsonFactory,
                request -> {})
                .build();

        // YouTube Search API를 사용하여 동영상 검색을 위한 요청 객체 생성
        YouTube.Search.List search = youtube.search().list(Collections.singletonList("id,snippet"));

        // API 키 설정
        search.setKey(API_KEY);

        // 검색어 설정
        // %20: 띄어쓰기
        String newSongName = songName.replace(" ", "+")
                .replace("(", "%28").replace(")", "%29");
        String newArtistName = artistName.replace(" ", "+")
                .replace("(", "%28").replace(")", "%29");
        String query = newSongName + "+" + newArtistName;

        log.info("검색어: " + query);
        search.setQ(query);

        // 첫 번째 동영상만 가져오도록 설정
        search.setMaxResults(1L);

        // 검색 요청 실행 및 응답 받아오기
        SearchListResponse searchResponse = search.execute();

        // 검색 결과에서 동영상 목록 가져오기
        List<SearchResult> searchResultList = searchResponse.getItems();

        if (searchResultList != null && !searchResultList.isEmpty()) {
            //검색 결과 중 첫 번째 동영상 정보 가져오기
            SearchResult searchResult = searchResultList.get(0);

            // 동영상의 ID와 제목 가져오기
            String videoId = searchResult.getId().getVideoId();
            String videoTitle = searchResult.getSnippet().getTitle();

            log.info("동영상 링크: " + videoId);
            log.info("동영상 제목: " + videoTitle);

            return videoId;
        }
        return null;
    }

    @Override
    public void uploadSong() throws IOException {
//        String jsonFilePath = "C:\\music\\song_meta.json";
//        insertJsonData(jsonFilePath);

        String csvFilePath = "C:\\music\\song_tag.csv";
        updateMongoWithCsv(csvFilePath);
    }

    private void updateMongoWithCsv(String csvFilePath) throws IOException {
        List<String[]> data = readCsv(csvFilePath);

        // data.size()
        for(int i=1; i< 50000; ++i){
            String[] row = data.get(i);
            int id = Integer.parseInt(row[0]);

            String tags = row[1].replaceAll("[{}]", "").replaceAll("'", "")
                    .replaceAll("\"", "").replaceAll(" ", ""); // 필요없는 문자제거
            List<String> tagList = Arrays.asList(tags.split(","));

            MusicCollection document = musicMongoRepository.findByMusicId(id);
            document.setTags(tagList);
            musicMongoRepository.save(document);
        }
    }

    // CSV 파일 읽기 메서드
    private List<String[]> readCsv(String csvFilePath) throws IOException {
        List<String[]> data = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(csvFilePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] values = splitCsvLine(line);
                data.add(values);
            }
        }
        return data;
    }

    // 괄호 안의 쉼표는 split 하지 않기 위한 함수
    private String[] splitCsvLine(String line) {
        List<String> values = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean insideQuotes = false;

        for (char c : line.toCharArray()) {
            if (c == ',' && !insideQuotes) {
                values.add(sb.toString());
                sb = new StringBuilder();
            } else if (c == '"') {
                insideQuotes = !insideQuotes;
            } else {
                sb.append(c);
            }
        }

        // 마지막 값 추가
        values.add(sb.toString());

        return values.toArray(new String[0]);
    }

    private void insertJsonData(String jsonFilePath){
        ObjectMapper objectMapper = new ObjectMapper();
        // JSON 파일 읽기
        File jsonFile = new File(jsonFilePath);

        // JSON 파일을 Java 객체로 읽어오기
        List<MusicCollection> objects = null;
        try {
            objects = objectMapper.readValue(jsonFile, new TypeReference<List<MusicCollection>>() {});
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        musicMongoRepository.saveAll(objects);
    }

//    @Override
//    public void uploadSongMeta(List<SongReq> songList) {
//        musicMongoRepository.saveAll(songList.stream()
//                .map(SongReq::toEntity)
//                .collect(Collectors.toList()));
//    }
//
//    @Override
//    public String searchMusicURI(String artistName, String songName){
//        ResponseEntity<String> responseEntity = requestMusicURIToSpotifyAPI(artistName, songName);
//
//        int statusCode = responseEntity.getStatusCode().value();
//        if(statusCode/100!=2){
//            log.error("[MusicServiceImpl/searchMusicURI] SpotifyAPI 에러: {}", responseEntity.getBody());
//            throw new MusicException(String.format("SpotifyAPI 에러 %s", responseEntity.getBody()));
//        }
//
//        for(int i=0; i<RESPONSE_NUM; ++i){
//            try{
//                JsonNode jsonNode = objectMapper.readTree(responseEntity.getBody());
//                JsonNode trackRoot = jsonNode.get("tracks").get("items").get(i);
//                Set<String> artistNamefound = trackRoot.get("artists")
//                        .findValuesAsText("name")
//                        .stream().collect(Collectors.toSet());
//                String songNamefound = trackRoot.get("name").asText();
//                String spotifyURI = trackRoot.get("uri").asText();
//
//                if (!songNamefound.contains(songName) && !artistNamefound.stream().anyMatch((anf->artistName.contains(anf)))){
//                    continue;
//                }
//                return spotifyURI;
//            } catch(JsonProcessingException je){
//                log.error("[MusicServiceImpl/searchMusicURI] json parsing 에러: {}", je.getMessage());
//                throw new MusicException(String.format("json parsing 에러: %s", je.getMessage()));
//            }
//        }
//        //throw new MusicException("노래명과 가수명에 해당하는 spotify uri가 존재하지 않습니다.");
//        return null;
//    }
//
//    private String getEngSongName(String artistName, String songName){
//        ResponseEntity<String> responseEntity = requestEngSongNameToiTunesAPI(artistName, songName);
//
//        try{
//            JsonNode jsonNode = objectMapper.readTree(responseEntity.getBody());
//            JsonNode trackRoot = jsonNode.get("results").get(0);
//            String songNamefound = trackRoot.get("trackName").asText();
//            return songNamefound;
//        } catch(JsonProcessingException je){
//            log.error("[MusicServiceImpl/getEngSongName] json parsing 에러: {}", je.getMessage());
//            throw new MusicException(String.format("json parsing 에러: %s", je.getMessage()));
//        }
//    }
//
//    private ResponseEntity<String> requestEngSongNameToiTunesAPI(String artistName, String songName){
//        HttpHeaders headers = new HttpHeaders();
//        //headers.add("Content-type", "application/json");
//        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
//
//        StringBuilder urlBuilder = new StringBuilder();
//        String artistNameEncoded = artistName.replace(" ", "+");
//        String songNameEncoded = songName.replace(" ", "+");
//
//        urlBuilder.append(ITUNES_SEARCH_URL)
//                .append(artistNameEncoded)
//                .append("+")
//                .append(songNameEncoded);
//        String url = urlBuilder.toString();
//
//        log.info("[MusicServiceImpl/requestEngSongNameToiTunesAPI] request url: {}", url);
//
//        try{
//            ResponseEntity<String> responseEntity
//                    = restTemplate.exchange(url, HttpMethod.GET, requestEntity, String.class);
//            //log.info("[MusicServiceImpl/requestEngSongNameToiTunesAPI] response: {}", responseEntity.getBody());
//            return responseEntity;
//        } catch(HttpClientErrorException e){
//            log.error("[MusicServiceImpl/getEngSongName] iTunesAPI 에러: {}", e.getMessage());
//            throw new MusicException("[MusicServiceImpl/getEngSongName] iTunesAPI 에러");
//        }
//
//    }
//
//    private ResponseEntity<String> requestMusicURIToSpotifyAPI(String artistName, String songName){
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Authorization", "Bearer " + spotifyApi.getAccessToken());
//        headers.add("Host", "api.spotify.com");
//        headers.add("Content-type", "application/json");
//        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
//
//        StringBuilder urlBuilder = new StringBuilder();
//
//
//        String songNameEncoded = songName.substring(0);
//        try{
//            songNameEncoded = getEngSongName(artistName, songName);
//        } catch(MusicException e){
//            log.info("[MusicServieImpl/getEngSongName] {}", e.getMessage());
//        } finally {
//            songNameEncoded = songNameEncoded.replace(" ", "%20");
//        }
//        String songNameKorEncoded = songName.replace(" ", "%20");
//
//        // TWS (투어스) -> TWS, 임창정 -> 임창정, 비비 (BIBI) -> BIBI
//        String artistNameEncoded = artistName.substring(0);
//        if(englishFinderPattern.matcher(artistNameEncoded).find()){
//            artistNameEncoded = artistNameFilterPattern.matcher(artistNameEncoded).replaceAll("").trim();
//        }
//        artistNameEncoded = artistNameEncoded.replace(" ", "%20");
//        urlBuilder.append(SPOTIFY_SEARCH_URL)
//                .append(songNameEncoded)
//                .append("%20track:")
//                .append(songNameKorEncoded)
//                .append("%20artist:")
//                .append(artistNameEncoded);
//        String url = urlBuilder.toString();
//        log.info("[MusicServiceImpl/requestMusicURIToSpotifyAPI] request url: {}", url);
//
//        ResponseEntity<String> responseEntity
//                = restTemplate.exchange(url, HttpMethod.GET, requestEntity, String.class);
//        //log.info("[MusicServiceImpl/requestMusicURIToSpotifyAPI] response: {}", responseEntity.getBody());
//        return responseEntity;
//    }
}