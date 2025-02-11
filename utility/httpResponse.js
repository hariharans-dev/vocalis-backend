function createApiResponse(data, code) {
  let status;
  if (code >= 200 && code < 300) {
    status = "success";
  } else {
    status = "error";
  }

  let response = {
    status: status,
    data: status === "success" ? data : null,
    error: status === "error" ? data : null,
  };

  return response;
}

export default createApiResponse;
