import { putAxios } from "src/api/util";


export const putTodo = async( id ) => {
    try{
        return await putAxios(`/schedule/my/${id}/delete`)
    }catch( err ){
        console.log(err)
    }
}
