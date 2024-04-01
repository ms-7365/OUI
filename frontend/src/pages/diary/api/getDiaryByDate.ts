import { getAxios } from "src/api/util";

export const getDiaryByDate = async ( params: { diaryId: number, date: string } ) => {
    try {
        console.log(params.diaryId, params.date)
        return await getAxios( `/diary/${params.diaryId}/${params.date}` )
    } catch( err ) {
        console.log(err);
    }
}
