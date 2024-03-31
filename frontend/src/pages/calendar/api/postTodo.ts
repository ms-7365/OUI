import { postAxios } from 'src/api/util'



export const postTodo = async (data:dataType) => {
    try{
        return await postAxios('/schedule/my', data);
    }catch(err){
        throw err
    }
}

interface dataType{
    diaryId: number,
    title: String,
    content: String,
    date: String,
    color: String,
    type: String
}