package com.emotionoui.oui.diary.repository;

import com.emotionoui.oui.diary.dto.EmotionClass;
import com.emotionoui.oui.diary.entity.DailyDiaryCollection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyDiaryMongoRepository extends MongoRepository<DailyDiaryCollection, String> {


    @Query(value = "{'_id': ?0}", fields = "{'emotion': 1, 'nickname': 1}")
    DailyDiaryCollection findEmotionByDailyId(String dailyId);

    @Query(value = "{'_id': ?0}", fields = "{'music': 1}")
    DailyDiaryCollection findMusicByDailyId(String dailyId);

    @Query(value = "{'_id': ?0}", fields = "{'comment': 1}")
    DailyDiaryCollection findCommentByDailyId(String dailyId);

    @Query(value = "{'_id': ?0}", fields = "{'emotion': 1}")
    EmotionClass findEmotionClassByDailyId(String dailyId);
}
