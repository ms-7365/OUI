import { postAxios } from "src/api/util";

export const postDiaryDeco = async ( data: dataType ) => {
    try {
        return await postAxios(`/diary/decorate/${data.dailyDiaryId}`, { decoration: data.decoration });
    } catch ( err ) {
        throw err;
    }
}

interface dataType {
    dailyDiaryId: number, 
    decoration: string,
}