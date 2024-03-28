package com.emotionoui.oui.auth.controller;

import com.emotionoui.oui.auth.dto.res.KakaoLoginRes;
import com.emotionoui.oui.auth.exception.LoginFailureException;
import com.emotionoui.oui.auth.jwt.JwtTokenProvider;
import com.emotionoui.oui.auth.redis.RedisPrefix;
import com.emotionoui.oui.auth.redis.RedisService;
import com.emotionoui.oui.auth.service.AuthServiceImpl;
import com.emotionoui.oui.member.entity.Member;
import com.emotionoui.oui.member.repository.MemberRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RequestMapping("/auth")
@RequiredArgsConstructor
@RestController
public class AuthController {

    private final MemberRepository memberRepository;
    private final AuthServiceImpl authServiceImpl;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisService redisService;

    /**
     * kakao로그인
     *
     * @param code
     * @param response
     * @return
     */
    @Transactional
    @GetMapping("/login/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestParam("code") String code, HttpServletResponse response) {
        try {
            // 카카오에서 사용자 email 받아오기
            KakaoLoginRes kakaoLoginRes = authServiceImpl.kakaoLogin(code, response);
            // 받아온 email로 jwt access, refresh 토큰 만들기
            String accessToken = jwtTokenProvider.createAccessToken(kakaoLoginRes.getEmail());
            String refreshToken = jwtTokenProvider.createRefreshToken(kakaoLoginRes.getEmail());

            System.out.println("AuthController.kakaoLogin- accessToken : "+accessToken);
            System.out.println("AuthController.kakaoLogin- refreshToken : "+refreshToken);

            // refreshToken 쿠키에 담기
            jwtTokenProvider.createRefreshTokenCookie(refreshToken, response);

            // redis에 토큰 저장
            String key = RedisPrefix.REFRESH_TOKEN.prefix() + kakaoLoginRes.getEmail();
            redisService.setValues(key, refreshToken, Duration.ofDays(3));
            System.out.println("redis : "+redisService.getValues(key));

            // 새로운 accessToken을 JSON 응답 본문에 담아 반환
            Map<String, String> tokenMap = new HashMap<>();
            tokenMap.put("accessToken", accessToken);

            String signupMSG = kakaoMemberCheckAndRegister(kakaoLoginRes);
            // 가입된 유저 확인 & 회원가입

            tokenMap.put("signupMSG", signupMSG);

            return ResponseEntity.ok().body(tokenMap);

        } catch (Exception e) { // 로그인 실패 시
            throw new LoginFailureException(e);
        }
    }

    /**
     * 로그아웃
     *
     * @param member
     * @return
     */
    @Transactional
    @GetMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal Member member) {
        // 레디스에서 리프레시토큰 삭제
        String key = RedisPrefix.REFRESH_TOKEN.prefix() + member.getEmail();
        redisService.deleteValues(key);
        return ResponseEntity.ok().build();
    }

    /**
     * 가입된 유저확인 & 회원가입(개인 다이어리 생성)
     *
     * @param kakaoLoginRes
     * @return
     */
    private String kakaoMemberCheckAndRegister(KakaoLoginRes kakaoLoginRes) {

        String email = kakaoLoginRes.getEmail();

        // nickname은 처음에는 email에서 뒷부분 뺀 걸로 설정해주자.
        int stop = 0;
        for(int i = 0; i<email.length(); i++){
            if(email.charAt(i)=='@'){
                stop = i;
                break;
            }
        }
        String memberNickname = email.substring(0,stop);

        Member kakaoMember = memberRepository.findByEmail(email).orElse(null);
        String signupMSG = null;
        // 가입되지 않은 회원이라면 회원가입
        if (kakaoMember == null) {
            kakaoMember = new Member(email, memberNickname);
            // 회원가입
            memberRepository.save(kakaoMember);

            // 개인 다이어리 생성
            authServiceImpl.createPrivateDiary(kakaoMember);

            signupMSG = "회원가입한 사용자입니다. 설문조사 페이지로 이동해주세요.";
        }

        // 탈퇴한 회원이라면 가입처리 후 개인 다이어리 생성
        if (kakaoMember.getIsDeleted()==1){
            kakaoMember.setIsDeleted(0);
            memberRepository.save(kakaoMember);

            // 개인 다이어리 생성
            authServiceImpl.createPrivateDiary(kakaoMember);

            signupMSG = "회원가입한 사용자입니다. 설문조사 페이지로 이동해주세요.";
        }
        return signupMSG;
    }

    /**
     * 리프레시 토큰 만료 검사 후 유효하면(레디스에 존재한다면) 액세스 토큰 발급
     *
     * @param request
     * @param response
     * @return
     */
    @PostMapping("/token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        // 쿠키에서 refreshToken 추출
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refreshToken")) {
                    refreshToken = cookie.getValue();
                    break; // refreshToken을 찾았으므로 반복 종료
                }
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.badRequest().body("refreshToken 값이 null입니다.");
        }

        // refreshToken 검증 및 새로운 accessToken 생성 로직
        try {
            // refreshToken이 redis에 존재한다면
            String email = jwtTokenProvider.getEmailFromToken(refreshToken);
            String key = RedisPrefix.REFRESH_TOKEN.prefix() + email;
            String savedRefreshToken = (String) redisService.getValues(key);
            System.out.println(savedRefreshToken);
            System.out.println(refreshToken);
            // 레디스에 저장된 리프레시토큰과 지금 받아온 리프레시 토큰이 같다면
            if (savedRefreshToken.equals(refreshToken)) {
                // authService의 generateNewAccessToken 메서드를 호출하여 새로운 accessToken, refreshToken을 발급
                String newAccessToken = authServiceImpl.generateNewAccessToken(refreshToken);
                String newRefreshToken = jwtTokenProvider.createRefreshToken(email);

                // 새로운 refreshToken을 쿠키에 담아서 반환하는 메소드를 호출.
                jwtTokenProvider.createRefreshTokenCookie(newRefreshToken, response);

                // redis에 있던 refreshToken 갱신
                redisService.setValues(key, newRefreshToken, Duration.ofDays(3));

                // 새로운 accessToken을 JSON 응답 본문에 담아 반환
                Map<String, String> tokenMap = new HashMap<>();
                tokenMap.put("accessToken", newAccessToken);
                return ResponseEntity.ok().body(tokenMap);

                // 새로운 accessToken을 쿠키에 담아서 반환하는 메소드를 호출.
//                jwtTokenProvider.createAccessTokenCookie(newAccessToken, response);

            } else { //같지 않다면
                System.out.println("레디스에 저장된 토큰과 달라용");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("레디스에 저장된 토큰과 달라용");
            }
        } catch (Exception e) {
            // refreshToken이 유효하지 않거나 처리 중 오류가 발생한 경우
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }

    /**
     * 회원탈퇴
     * @return
     */
    @Transactional
    @PutMapping
    public ResponseEntity<Void> deleteMember(@AuthenticationPrincipal Member member){
        authServiceImpl.deleteMember(member);
        return ResponseEntity.ok().build();
    }

}


