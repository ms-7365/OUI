import { putAxios } from "src/api/util";


export const updateTodo = async( id, data:dataType ) => {
    try{
        return await putAxios(`/schedule/my/${id}`, data)
    }catch( err ){
        console.log(err)
    }
}

interface dataType{
    title: String,
    content: String,
    date: String,
    color: String,
}