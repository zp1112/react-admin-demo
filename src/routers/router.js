import React, { Component } from 'react'
import {
  HashRouter as Router,
  Switch
} from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import routers from './router.config'
import Bundle from './bundle'
import AuthorizedRoute from './AuthorizedRoute';
// 404组件
import Admin from '../containers/admin/admin.js'
// 404组件
import NotFound from '../containers/notFound/notFound'
// 加载中
import { Spin } from 'antd'

// 后台主页
// const Admin = props => (
//   <Bundle {...props} load={() => import('../containers/admin/admin.js')}>
//     {Comp => {
//       return Comp ? <Comp {...props} /> : <div>加载中...</div>
//     }}
//   </Bundle>
// )

// 登录
const Login = props => (
  <Bundle {...props} load={() => import('../containers/login/login.js')}>
    {Comp => {
      return Comp ? <Comp {...props} /> : <div>加载中...</div>
    }}
  </Bundle>
)

class router extends Component {
  static propTypes = {
    isLogin: PropTypes.any,
    loading: PropTypes.bool
  }
  render() {
    return (
      <Router>
        <Switch>
          {routers.map(rc => {
            const { path, component, authority, redirectPath, ...rest } = rc;
            return (
              <Admin {...rc} { ...this.props }>
                <AuthorizedRoute
                  key={path}
                  path={path}
                  component={component}
                  authority={authority}
                  redirectPath={redirectPath}
                  {...rest}
                />
              </Admin>
            );
          })}
        </Switch>
    </Router>
    )
  }
}

const mapState = state => {
  return {
    isLogin: state.verifyUser.isLogin,
    loading: state.loading.show
  }
}

export default connect(mapState)(router)
