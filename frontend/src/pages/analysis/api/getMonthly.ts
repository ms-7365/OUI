import { getAxios } from "src/api/util"

export const getMonthly = async ( data:dataType ) => {
    try{
        return await getAxios( '/statistics/my/month',data);
    }catch( err ){
        console.log( err )
    }
}

interface dataType{
    diaryId: number,
    date: String
}