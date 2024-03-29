import { getAxios } from "src/api/util"

export const getWeekly = async ( data:dataType ) => {
    try{
        return await getAxios( '/statistics/my/week', data);
    }catch( err ){
        console.log( err )
    }
}

interface dataType{
    diaryId: number,
    date: String
}