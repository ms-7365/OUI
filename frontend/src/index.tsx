import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyle from './styles/global';
import axios from 'axios';
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { CookiesProvider } from 'react-cookie';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//       navigator.serviceWorker.register('service-worker.ts') // serviceWorker 파일 경로
//           .then((reg) => {
//               console.log('Service worker registered.', reg);
//           })
//           .catch(e => console.log(e));
//   });
// }

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <>
    <CookiesProvider>
      <GlobalStyle />
      <App />
    </CookiesProvider>

  </>
)
serviceWorkerRegistration.register();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
