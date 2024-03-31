import { postAxios } from "src/api/util"

export const postAccept = async ( data: dataType  ) => {
    try{
        return await postAxios( `/alarm/accept/${ data.diaryId }` )
    }catch( err ){
        console.log( err )
    }
}

interface dataType{
    diaryId: number,
}

