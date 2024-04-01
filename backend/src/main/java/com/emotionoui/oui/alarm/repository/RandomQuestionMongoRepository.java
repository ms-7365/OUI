package com.emotionoui.oui.alarm.repository;

import com.emotionoui.oui.alarm.entity.RandomQuestionCollection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RandomQuestionMongoRepository extends MongoRepository<RandomQuestionCollection, String> {

    @Query(value = "{'date': ?0}", fields = "{'question': 1}")
    String findByDate(String date);

}
