import util from "util";
import AWSLambda from "aws-lambda";

export const errorResponse = (
  statusCode: number,
  message: string,
  ...variables: string[]
): AWSLambda.APIGatewayProxyResult => {
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

const getUpperMesh = (
  thirdMeshCode: string
): false | [firstMesh: string, secondMesh: string, thrdMesh: string] => {
  if (!thirdMeshCode.match(/^[0-9]{8}$/)) {
    return false;
  } else {
    return [
      thirdMeshCode.slice(0, 4),
      thirdMeshCode.slice(0, 6),
      thirdMeshCode,
    ];
  }
};

export const formatURL = (
  year: number,
  meshCode: string,
  endpointFormat?: string
): string | false => {
  const meshCodeTuple = getUpperMesh(meshCode);
  if (meshCodeTuple) {
    return util.format(
      endpointFormat || process.env.NARO_AGROENV_STATIC_API_ENDPOINT, // like "https://example.com/%s/%s/%s/%s.json"。%s[] = [year, 1st mesh, 2nd mesh, 3rd mesh]
      year,
      ...meshCodeTuple
    );
  } else {
    return false;
  }
};

export const listYears = (startYear: number, endYear: number): number[] => {
  return Array(endYear - startYear + 1)
    .fill(0)
    .map((_, index) => index + startYear);
};

export const listCombinations = (
  years: number[],
  meshCodes: string[]
): { year: number; meshCode: string }[] => {
  const combinations: { year: number; meshCode: string }[] = [];
  for (const year of years) {
    for (const meshCode of meshCodes) {
      combinations.push({ year, meshCode });
    }
  }
  return combinations;
};
