import React from 'react';
import { Star } from '../object/Star';
import { SelectedStar } from './SelectedStar';
import { SelectedPlanet } from './SelectedPlanet';
import { Planet } from '../object/Planet';
import { useGetMouseOver, useGetObjectList, useGetSelected } from '../state/selectors';

export function SelectedObject() {
  let selected = useGetSelected();
  let mouseOver = useGetMouseOver();
  let objectList = useGetObjectList();

  let selectedObject = objectList.findById(selected);
  let mouseOverObject = objectList.findById(mouseOver);
  selectedObject = selectedObject ? selectedObject : mouseOverObject;

  return (
    <div>
      {selectedObject instanceof Star && <SelectedStar star={selectedObject} />}
      {selectedObject instanceof Planet && <SelectedPlanet planet={selectedObject} />}
    </div>
  );
}

export interface SelectedObjectProps {}
