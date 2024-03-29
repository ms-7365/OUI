import { createGlobalStyle } from 'styled-components';
import DoveMayo from '../asset/fonts/DoveMayo.woff';
import DoveMayoBold from '../asset/fonts/DoveMayo_Bold.woff';
import IMHyeMin from '../asset/fonts/IMHyeMin.woff';
import IMHyeMinBold from '../asset/fonts/IMHyeMin_Bold.woff';
import Cafe24Supermagic from '../asset/fonts/Cafe24Supermagic.woff';
import Cafe24SupermagicBold from '../asset/fonts/Cafe24Supermagic_Bold.woff';
import HakgyoansimGaeulsopung from '../asset/fonts/HakgyoansimGaeulsopung.woff';
import HakgyoansimGaeulsopungBold from '../asset/fonts/HakgyoansimGaeulsopung_Bold.woff';

const GlobalStyle = createGlobalStyle`
      @font-face {
            font-family: 'DoveMayo';
            src: local('DoveMayo'), url(${DoveMayo}) format('woff');
            font-style: normal;
            font-weight: normal;
      }
      @font-face {
            font-family: 'DoveMayoBold';
            src: local('DoveMayoBold'), url(${DoveMayoBold}) format('woff');
            font-style: normal;
            font-weight: bold;
      }
      @font-face {
            font-family: 'IMHyeMin';
            src: local('IMHyeMin'), url(${IMHyeMin}) format('woff');
            font-style: normal;
            font-weight: normal;
      }
      @font-face {
            font-family: 'IMHyeMinBold';
            src: local('IMHyeMinBold'), url(${IMHyeMinBold}) format('woff');
            font-style: normal;
            font-weight: bold;
      }
      @font-face {
            font-family: 'Cafe24Supermagic';
            src: local('Cafe24Supermagic'), url(${Cafe24Supermagic}) format('woff');
            font-style: normal;
            font-weight: normal;
      }
      @font-face {
            font-family: 'Cafe24SupermagicBold';
            src: local('Cafe24SupermagicBold'), url(${Cafe24SupermagicBold}) format('woff');
            font-style: normal;
            font-weight: bold;
      }
      @font-face {
            font-family: 'HakgyoansimGaeulsopung';
            src: local('HakgyoansimGaeulsopung'), url(${HakgyoansimGaeulsopung}) format('woff');
            font-style: normal;
            font-weight: normal;
      }
      @font-face {
            font-family: 'HakgyoansimGaeulsopungBold';
            src: local('HakgyoansimGaeulsopungBold'), url(${HakgyoansimGaeulsopungBold}) format('woff');
            font-style: normal;
            font-weight: bold;
      }
`

export default GlobalStyle;