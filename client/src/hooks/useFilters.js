import { useSelector, useDispatch } from 'react-redux';
import { setFilters, resetFilters } from '../redux/slices/filterSlice';

export function useFilters() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filter?.filters);

  return {
    filters,
    setFilters: (newFilters) => dispatch(setFilters(newFilters)),
    resetFilters: () => dispatch(resetFilters()),
  };
}

export default useFilters;
