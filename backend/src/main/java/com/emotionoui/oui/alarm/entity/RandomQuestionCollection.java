package com.emotionoui.oui.alarm.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "RANDOM_QUESTION")
public class RandomQuestionCollection {

    @Id
    @Field("_id")
    private ObjectId objectId;

    private String question;

    @Field("randomId")
    private Integer id;

    private String date;
}
