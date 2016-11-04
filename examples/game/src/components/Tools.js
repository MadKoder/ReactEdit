import {nbCellH} from './Constants';

export const makeCellId = (x, y) => x + (y * nbCellH);
