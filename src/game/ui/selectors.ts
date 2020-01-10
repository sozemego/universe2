import { AppState } from '../../state';
import { useSelector } from 'react-redux';

export function useGetObjectToSpawn(state?: AppState) {
  if (state) {
    return state.ui.objectToSpawn;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSelector((state: AppState) => state.ui.objectToSpawn);
}
