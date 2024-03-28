import { getAxios } from "src/api/util"

export const getAlarm = async (  ) => {
    try{
        return await getAxios( '/alarm' )
    }catch( err ){
        console.log( err )
    }
}

