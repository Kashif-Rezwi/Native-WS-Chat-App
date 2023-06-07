export const findUnique = (arr) => {
  let obj = {};

  arr.forEach((el) => {
    if (obj[el.user] === undefined) {
      obj[el.user] = 1;
    }
  });

  return Object.keys(obj);
};
