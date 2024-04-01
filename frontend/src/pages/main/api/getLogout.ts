import { getAxios } from "src/api/util"

export const getLogout = async () => {
    try{
        return await getAxios( '/auth/logout')
    }catch( err ){
        console.log( err )
    }
}

