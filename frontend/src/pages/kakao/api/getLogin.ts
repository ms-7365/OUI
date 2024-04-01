// import axios from "axios"


// export const getLogin = async ( params: String ) => {
//     try{        
//         return await axios.get( `/auth/login/kakao?code=${params}`)
//     }catch( err ){
//         console.log( err )
//     }
// }

import axios from "axios"

const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      }
  });

export const getLogin = async ( params: String ) => {
    try{        
        return await instance.get( `/auth/login/kakao?code=${params}`)
    }catch( err ){
        console.log( err )
    }
}
