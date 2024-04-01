import { getAxios } from "src/api/util";

export const getEmotions = async ( dailyDiaryId: number ) => {
    try {
        return await getAxios( `/diary/emotion/${dailyDiaryId}` )
    } catch( err ) {
        console.log(err);
    }
}
