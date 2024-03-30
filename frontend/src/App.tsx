import { Suspense, useState } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import routers from './pages/router'
import useStore from './store'
import { CookiesProvider } from 'react-cookie';
import { StyledEngineProvider } from '@mui/material/styles';
import styled from 'styled-components';


const AppWrapper = styled.div`
  margin: auto; 
  max-width: 1024px; 
  width: 100%; 
  min-height: 100vh;
  background-color: #F9F3EE;
`;

const queryClient = new QueryClient() // QueryClient 생성

function App() {

  
  const [ router ] = useState( createBrowserRouter( routers ))

  return (
    <CookiesProvider>
    <QueryClientProvider client={ queryClient }> {/* QueryClientProvider 추가 */}
      <Suspense>
        <StyledEngineProvider injectFirst>
          <AppWrapper>
            <RouterProvider router={ router } />
          </AppWrapper>
        </StyledEngineProvider>
      </Suspense>
      <ReactQueryDevtools /> {/* DevTools를 사용하려면 추가 */}
    </QueryClientProvider>
    </CookiesProvider>
  )
}

export default App;

