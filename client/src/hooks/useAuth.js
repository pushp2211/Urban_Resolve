import { useSelector, useDispatch } from 'react-redux';
import { setUser, logoutUser, checkAuth, loginUser } from '../redux/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, loading, authChecked, error } = useSelector((state) => state.auth);

  return {
    user,
    loading,
    authChecked,
    error,
    login: (userData) => dispatch(setUser(userData)),
    loginUser: (creds) => dispatch(loginUser(creds)),
    logout: () => dispatch(logoutUser()),
    setUser: (userData) => dispatch(setUser(userData)),
    checkAuth: () => dispatch(checkAuth()),
  };
}

export default useAuth;
