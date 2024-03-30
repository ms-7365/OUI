import useStore from 'src/store'
import { useCookies } from 'react-cookie';
import axios from 'axios'


const useAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

useAxios.interceptors.request.use( 
  async( config ) => {
      const storedDataString = localStorage.getItem('userStorage');
            
      if (storedDataString) {
        const storedData = JSON.parse(storedDataString);

        const accessToken = storedData?.state?.accessToken;
        
        if( accessToken ){
          config.headers['Authorization'] = `Bearer ${ accessToken }` // 앞에 Bearer를 추가해야 요청 성공
        }
  
        return config
      }
      
  },
  ( error ) => {
    return Promise.reject( error )
  }
)

useAxios.interceptors.response.use(

  async( response ) => {
    return response
  },
  async( error ) => {
    const { status } = error

    console.log(error)

    if( error?.response?.status === 409 ){
      return error.response
    }

    if( error?.response?.status === 401 || error === 401 || status === 401 ){

      const [ cookies, setCookie ] = useCookies([ 'refreshToken' ]);
      const { setAccessToken, setIsLogin } = useStore()

      // if( localStorage.getItem('refreshToken')){
      //   const refreshToken = useStore();
      //   const data = { "Authorization-refresh" : refreshToken }
      //   try{
      //     const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/reissue`, { headers : data })
      //     useStore.setState({ isLogin: true })
      //     useStore.setState({ accessToken: response?.headers?.authorization })

      //     error.config.headers.Authorization = response?.headers?.authorization
      //     return axios.request(error.config)
      //   } catch( refreshError ){
      //   }
       
      // }
      if( cookies.refreshToken ){

        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `refreshToken=${cookies.refreshToken}`
          }
        }
        
        try{
          const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/token`, { refreshToken : cookies.refreshToken }, config)
          setAccessToken(response?.data?.accessToken)

          error.config.headers.Authorization = response?.headers?.authorization
          return axios.request(error.config)
        } catch( refreshError ){
        }
       
      }
    }
  }
)


export const getAxios =  async ( url: string, params?: any )  => {
  try {
    const response = await useAxios.get(url, { params })
    return response
  } catch( error ){
    return Promise.reject(error)
  }
} 

export const postAxios =  async( url: string, data?: any, multi?:any )  =>{
  try{
    const response = await useAxios.post( url, data, multi )
    console.log(response)
    return response
  } catch( error ){
    return Promise.reject( error )
  }
}

export const putAxios =  async( url: string, data?: any )  =>{
  try{
    const response = await useAxios.put( url, data )
    console.log(response)
    return response
  } catch( error ){
    return Promise.reject( error )
  }
}

export const deleteAxios = async( url: string, params?: any ) => {
  try{
    const response = await useAxios.delete( url, { params } )
    return response
  } catch( error ){
    return Promise.reject( error )
  }
}

export const patchAxios = async(url: string, data?: any ) =>{
  try{
    const response = await useAxios.patch( url, data )
    console.log(response)
    return response
  } catch( error ){
    return Promise.reject( error )
  }

}

export default useAxios
