package com.emotionoui.oui.diary.entity;

import com.emotionoui.oui.diary.dto.EmotionClass;
import com.emotionoui.oui.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Document(collection = "DAILY_DIARY")
public class DailyDiaryCollection {

    @Id
    private ObjectId id;

    // 다이어리 ID
    private Integer diaryId;

    // 작성자 ID
    private Integer memberId;

    // 일기 내용
    private String content;

    // 일기 꾸미기 내용
    private String decoration;

    // 삭제 유무
    private Integer isDeleted;

    // 텍스트 기반 감정분석 결과
    private EmotionClass emotion;

    // 음악 추천 리스트
    private List<String> music;

    // 코멘트 내용
    private String comment;

    // 작성자 닉네임
    private String nickname;



    @Builder
    public DailyDiaryCollection(Integer diaryId, Integer memberId, String content, Integer isDeleted,String nickname){
        this.diaryId = diaryId;
        this.memberId = memberId;
        this.content = content;
        this.isDeleted = isDeleted;
        this.nickname = nickname;
    }
}