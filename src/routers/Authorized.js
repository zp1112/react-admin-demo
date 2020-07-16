import { connect } from 'react-redux';

function Authorized(props) {
  const { children, userInfo, authority, noMatch } = props;
  const { currentAuthority } = userInfo || {};
  if (!authority) return children;
  const _authority = Array.isArray(authority) ? authority : [authority];
  if (_authority.includes(currentAuthority)) return children;
  return noMatch;
}

export default connect(store => ({ userInfo: {} }))(Authorized);