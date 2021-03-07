import util from "util";

export const errorResponse = (
  statusCode: number,
  message: string,
  ...variables: string[]
) => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: util.format(message, ...variables),
    }),
  };
};
