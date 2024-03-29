import { getAxios } from "src/api/util"

export const getShareCalendar = async ( data: dataType ) => {
    try{
        return await getAxios( `/calendar/${data.diaryId}`, { date: data.date })
    }catch( err ){
        console.log( err )
    }
}

interface dataType{
    diaryId: number,
    date: string,
}