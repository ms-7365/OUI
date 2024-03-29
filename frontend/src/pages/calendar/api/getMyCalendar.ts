import { getAxios } from "src/api/util"

export const getCalendar = async ( params: string ) => {
    try{
        return await getAxios( '/calendar/my', { date: params })
    }catch( err ){
        console.log( err )
    }
}
