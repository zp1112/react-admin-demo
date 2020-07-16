import Home from '../containers/home/home';
import Login from '../containers/login/login';
import User from '../containers/user/list';
import NotFound from '../containers/notFound/notFound';

export default [
  {
    exact: true,
    path: '/',
    menuName: '首页',
    component: Home,
  },
  {
    path: '/login',
    component: Login,
    redirectPath: '/login',
  },
  {
    path: '/user',
    component: User,
    menuName: '用户',
    authority: ['user', 'admin'],
    redirectPath: '/notfound',
  },
  {
    path: '/notfound',
    component: NotFound,
  },
];