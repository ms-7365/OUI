import { getAxios } from "src/api/util"

export const getDailyDiary = async ( id: String ) => {
    try{
        return await getAxios( `/calendar/day`, { mongoId: id } )
    }catch( err ){
        console.log( err )
    }
}