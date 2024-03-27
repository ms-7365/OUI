import { getAxios } from "src/api/util"

export const getFIndMember = async ( data: String ) => {
    try{
        return await getAxios( '/member/search', { memberEmail:data } )
    }catch( err ){
        console.log( err )
    }
}

