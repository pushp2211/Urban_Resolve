import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '../redux/slices/themeSlice';

export function useThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme?.mode || 'light');

  return {
    mode,
    toggleTheme: () => dispatch(toggleTheme()),
    setTheme: (newMode) => dispatch(setTheme(newMode)),
  };
}

export default useThemeToggle;
