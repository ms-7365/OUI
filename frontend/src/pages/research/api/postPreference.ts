import { postAxios } from "src/api/util";

export const postPreference = async ( data: dataType ) =>{
    try{
        return await postAxios( '/survey/preference' , data )
    }catch( err ){
        console.log( err )
    }
    
}

interface dataType{
    type: string,
}
