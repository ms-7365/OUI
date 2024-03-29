import { postAxios } from "src/api/util"

export const postCreateDiary = async ( data:dataType ) => {
    try{
        return await postAxios( '/main/diary', data )
    }catch( err ){
        console.log( err )
    }
}

interface dataType{
    diaryName: String,
    templateId: number,
    members: String[],
}
