import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading, setGlobalLoading } from '../redux/slices/loadingSlice';

export function useLoading() {
  const dispatch = useDispatch();
  const globalLoading = useSelector((state) => state.loading?.globalLoading || false);

  return {
    globalLoading,
    showLoading: () => dispatch(showLoading()),
    hideLoading: () => dispatch(hideLoading()),
    setGlobalLoading: (val) => dispatch(setGlobalLoading(val)),
  };
}

export default useLoading;
