import React from 'react';
import { Star } from '../object/Star';
import { SelectedStar } from './SelectedStar';
import { SelectedPlanet } from './planet/SelectedPlanet';
import { Planet } from '../object/Planet';
import { useGetObjectList, useGetSelected, useGetSelectedObjectIsModal } from '../state/selectors';
import { SelectedPlanetModal } from './planet/SelectedPlanetModal';

export function SelectedObject() {
  let selected = useGetSelected();
  let objectList = useGetObjectList();
  let selectedObjectIsModal = useGetSelectedObjectIsModal();

  let selectedObject = objectList.findById(selected);

  return (
    <div>
      {!selectedObjectIsModal && selectedObject instanceof Star && (
        <SelectedStar star={selectedObject} />
      )}
      {!selectedObjectIsModal && selectedObject instanceof Planet && (
        <SelectedPlanet planet={selectedObject} />
      )}
      {selectedObjectIsModal && selectedObject instanceof Planet && (
        <SelectedPlanetModal planet={selectedObject} />
      )}
    </div>
  );
}

export interface SelectedObjectProps {}
