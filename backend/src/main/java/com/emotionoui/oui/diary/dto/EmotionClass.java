package com.emotionoui.oui.diary.dto;

import lombok.Data;

import java.util.List;

@Data
public class EmotionClass {
    private Double happy;
    private Double comfortable;
    private Double embarrassed;
    private Double angry;
    private Double doubtful;
    private Double sad;
    private List<String> emotionList;

//    public String getMaxEmotion(){
//        String mainEmotion = "happy";
//        double max = happy;
//
//        if(max<comfortable){
//            mainEmotion = "comfortable";
//            max = comfortable;
//        }
//        if(max<embarrassed){
//            mainEmotion = "embarrassed";
//            max = embarrassed;
//        }
//        if(max<angry){
//            mainEmotion = "angry";
//            max = angry;
//        }
//        if(max<doubtful){
//            mainEmotion = "doubtful";
//            max = doubtful;
//        }
//        if(max<sad){
//            mainEmotion = "sad";
//            max = sad;
//        }
//
//        return mainEmotion;
//    }
}
