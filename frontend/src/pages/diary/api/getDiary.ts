import { getAxios } from "src/api/util";

export const getDiary = async ( params: number ) => {
    try {
        return await getAxios( `/diary/${params}` )
    } catch( err ) {
        console.log( err );
    }
}
