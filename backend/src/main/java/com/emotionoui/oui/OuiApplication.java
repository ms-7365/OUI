package com.emotionoui.oui;

import com.emotionoui.oui.music.config.SpotifyCredential;
import com.emotionoui.oui.music.service.MusicService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@RequiredArgsConstructor
@PropertySource("/env/env.yml")
@EnableJpaAuditing
@EnableScheduling
@Slf4j
public class OuiApplication {

    public static void main(String[] args) {
        SpringApplication.run(OuiApplication.class, args);
    }

    private final SpotifyCredential spotifyCredential;

    @PostConstruct
    public void getSpotifyCredential(){
        log.info("[OuiApplication/getSpotifyCredential] request access token");
        spotifyCredential.clientCredentials_sync();
    }

}
