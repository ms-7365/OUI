import { getAxios } from "src/api/util"

export const getDiaryMember = async ( diaryId: number ) => {
    try{
        return await getAxios( `/calendar/${diaryId}/members` )
    }catch( err ){
        console.log( err )
    }
}