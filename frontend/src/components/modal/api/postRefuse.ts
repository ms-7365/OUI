import { postAxios } from "src/api/util"

export const postRefuse = async ( data: dataType  ) => {
    try{
        return await postAxios( `/alarm/refuse/${ data.diaryId }` )
    }catch( err ){
        console.log( err )
    }
}

interface dataType{
    diaryId: number,
}

