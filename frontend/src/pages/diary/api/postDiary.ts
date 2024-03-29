import { postAxios } from "src/api/util";

export const postDiary = async (data: object) => {
    try {
        return await postAxios('/diary', data);
    } catch (err) {
        throw err;
    }
}