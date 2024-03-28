import { postAxios } from "src/api/util"

export const postDeviceToken = async ( deviceToken:String ) => {
    try{
        return await postAxios( '/alarm/device',deviceToken )
    }catch( err ){
        console.log( err )
    }
}

