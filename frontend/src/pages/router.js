import { useRouter } from '../hooks'

export const routes = [
    { path: 'diary/write'},
    { path: 'diary/write', dynamicPath: `diary/write/:diaryId` },
    { path: 'diary/edit' },
    { path: 'diary/edit', dynamicPath: `diary/edit/:dailyDiaryId` },
    { path: 'diary/deco' },
    { path: 'diary/deco', dynamicPath: `diary/deco/:dailyDiaryId` },
    { path: 'diary' },
    { path: 'diary', dynamicPath: `diary/:dailyDiaryId` },
    { path: 'calendar' },
    { path: 'calendar', dynamicPath: `calendar/:diaryId` },
    { path: 'main' },
    { path: 'mypage' },
    { path: 'login' },
    { path: 'research'},
    { path: 'analysis'},
    { path: 'shareanalysis' },
    { path: 'kakao', dynamicPath: 'auth/login/kakao'},
]

const lazyModules = routes?.map( ( { path, dynamicPath } ) => useRouter( path, dynamicPath ) )

lazyModules.unshift( {
    path: '/',
    lazy: async () => {
        const module = await import( `./login` )
        return {
            Component: module.default
        }
    }
} )

export default lazyModules
