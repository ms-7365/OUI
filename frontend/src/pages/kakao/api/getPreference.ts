import { getAxios } from "src/api/util"

export const getPreference = async () => {
    try{
        return await getAxios( '/survey')
    }catch( err ){
        console.log( err )
    }
}

