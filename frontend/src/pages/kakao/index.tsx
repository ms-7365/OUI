import { useEffect, useRef } from 'react'
import { getLogin, getPreference } from './api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import useStore from 'src/store'

const Kakao = () => {

  const navigator = useNavigate()

  const { setAccessToken, setIsLogin } = useStore()

  const isPost = useRef<boolean>(false)

  const isNew = () => {
    getPreference().then((res)=>{
      res.data ? navigator('/main') : navigator('/research')
    })
  }
  
  // useMutation => 비동기 작업 처리
  const kakaoMutations = useMutation( getLogin, {
    onSuccess: (res) => {
      setAccessToken( res?.data?.accessToken ) // 어떤 속성이 null 또는 undefined일 경우 에러방지하고 그냥 undefined 반환

      setIsLogin( true )
      isNew()
      // navigator('/main')

    },
    onError: ( err ) => {
      console.log( err )
      alert( "로그인 실패했습니다" )
      navigator( '/login' )
    } 
  })

    
  const urlParam = new URLSearchParams( window.location.search )
  const code = urlParam.get( 'code' )

  /**
   * useEffect => code가 변경될 때마다 실행
   * code는 카카오 로그인 후에 URL 쿼리 파람에서 가져옴 
   * isPost.current가 true이면 이미 요청을 보냈다는 것을 의미하므로, 다시 요청 x
   * 그렇지 않으면 kakaoMutations.mutateAsync(code)를 호출하여 로그인 시도
   */
  useEffect(()=>{
    if( isPost.current ) return

    isPost.current = true
    kakaoMutations.mutateAsync( code )

  }, [ code, kakaoMutations])


  return(<div></div>)
  
}

export default Kakao

