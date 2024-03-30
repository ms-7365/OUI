import { postAxios } from 'src/api/util'



export const postUrge = async ( data:dataType ) => {
    try{
        return await postAxios(`/calender/push/${data.diaryId}`, { date: data.date });
    }catch(err){
        throw err
    }
}

interface dataType{
    diaryId: number,
    date: String
}