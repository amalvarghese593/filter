export const transformValue = (val, type) => {
  if (type === "boolean") {
    return val === "true" ? true : false;
  } else if (type === "object") {
    return JSON.parse(val);
    // return JSON.parse(JSON.stringify(val));
  } else return val;
};
