export const convertDateToTimestamp = (date?: Date) => {
  return date
    ? date.toISOString().slice(0, 19).replace("T", " ")
    : new Date().toISOString().slice(0, 19).replace("T", " ");
};
