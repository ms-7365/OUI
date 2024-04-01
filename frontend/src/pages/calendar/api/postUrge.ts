import { postAxios } from 'src/api/util'

export const postUrge = async ( data:dataType ) => {

    try{
        console.log(data.date)
        return await postAxios(`/calendar/push/${data.diaryId}`, { dailyDate: data.date, memberId: data.memberId });
    }catch(err){
        throw err
    }
}

interface dataType{
    diaryId: number,
    memberId: number
    date: String
}