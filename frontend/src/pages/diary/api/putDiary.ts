import { putAxios } from 'src/api/util'

interface dataType{
    dailyDiaryId: number,
    dailyDate: string,
    dailyContent: String
}

export const putDiary = async (data: dataType) => {
    try{
        const response = await putAxios(`/diary/${data.dailyDiaryId}`, { dailyDate: data.dailyDate, dailyContent: data.dailyContent });
        return response
    }catch(err){
        throw err
    }
}