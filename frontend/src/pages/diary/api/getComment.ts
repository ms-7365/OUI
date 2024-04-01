import { getAxios } from "src/api/util";

export const getComment = async ( dailyDiaryId: number ) => {
    try {
        return await getAxios( `/diary/comment/${dailyDiaryId}` )
    } catch( err ) {
        console.log(err);
    }
}
