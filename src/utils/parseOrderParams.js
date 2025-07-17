import { SORT_ORDER } from '../constans/index.js';

const parseSortOrder = (order) => {
  return Object.values(SORT_ORDER).includes(order) ? order : SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  const keys = ['_id', 'name', 'phoneNumber'];

  return keys.includes(sortBy) ? sortBy : 'name';
};

export const parseOrderParams = ({ sortBy, sortOrder }) => {
  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return { sortBy: parsedSortBy, sortOrder: parsedSortOrder };
};
