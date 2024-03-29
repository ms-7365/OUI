import { getAxios } from "src/api/util"

export const getDiary = async () => {
    try{
        return await getAxios( '/main')
    }catch( err ){
        console.log( err )
    }
}

