export const findUnique = (arr) => {
  let obj = {};

  arr.forEach((el) => {
    if (obj[el.client] === undefined && el.active) {
      obj[el.client] = 1;
    }
  });

  return Object.keys(obj);
};
