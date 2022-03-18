export const convertDateToTimestamp = (date?: Date) => {
  return (date || new Date()).toISOString().slice(0, 19).replace("T", " ");

  //   return date
  //     ? date.toISOString().slice(0, 19).replace("T", " ")
  //     : new Date().toISOString().slice(0, 19).replace("T", " ");
};
