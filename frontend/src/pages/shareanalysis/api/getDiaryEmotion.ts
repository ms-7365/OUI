import { getAxios } from "src/api/util"

export const getDiaryEmotion = async ( data:dataType ) => {
    try{
        return await getAxios( `/statistics/${ data.diaryId }`,data);
    }catch( err ){
        console.log( err )
    }
}

interface dataType{
    diaryId: number,
    date: String
}