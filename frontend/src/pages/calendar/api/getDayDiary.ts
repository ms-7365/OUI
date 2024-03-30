import { getAxios } from "src/api/util"

export const getDayDiary = async ( data: dataType ) => {
    try{
        const res =  await getAxios( `/calendar/${data.diaryId}/day?${data.dailyId.map(d => `dailyId=${d}&`)}` )
        return res;
    }catch( err ){
        console.log( err )
    }
}

interface dataType{
    diaryId: number,
    dailyId: number[]
}