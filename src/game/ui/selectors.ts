import { AppState } from '../../state';
import { useSelector } from 'react-redux';

export function useGetObjectToSpawn(state?: AppState) {
  if (state) {
    return state.ui.objectToSpawn;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let objectToSpawn = useSelector((state: AppState) => state.ui.objectToSpawn);
  return JSON.parse(JSON.stringify(objectToSpawn));
}

export function useGetServiceStatsMap() {
  return useSelector((state: AppState) => state.ui.serviceStatsMap);
}
