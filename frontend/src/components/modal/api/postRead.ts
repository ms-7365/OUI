import { postAxios } from "src/api/util"

export const postRead = async ( data: dataType  ) => {
    try{
        return await postAxios( `/alarm/read/${ data.alarmId }` )
    }catch( err ){
        console.log( err )
    }
}

interface dataType{
    alarmId: number,
}

