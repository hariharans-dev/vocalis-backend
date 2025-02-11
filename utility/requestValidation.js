const requestValidation = (fields, body) => {
  return fields.every((field) => field in body);
};

const requestParameter = (feilds, body) => {
  for (var i in body) {
    if (!feilds.includes(i)) {
      return false;
    }
  }
  return true;
};

export { requestValidation, requestParameter };
