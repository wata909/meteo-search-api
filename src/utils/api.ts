type QueryDataParams = {
  startYear: number;
  endYear: number;
  startMonth: number;
  endMonth: number;
  meshCodes: string[];
};

type StaticAPIResponseItem = [
  d: string,
  tm: number | null,
  pr: number | null,
  tn: number | null,
  sr: number | null,
  tx: number | null,
  sd: number | null
];

export type QueryResponse = {
  [meshCode: string]: StaticAPIResponseItem[];
};

export const queryData = async (
  query: QueryDataParams
): Promise<QueryResponse> => {
  // NOTE: This is a mock.
  const apiResponse: StaticAPIResponseItem[] = [
    ["2015-3-1", 5.3, 2.1, 1.2, 3.7, 1.5, 1.2],
  ];
  return query.meshCodes.reduce<QueryResponse>((prev, meshCode) => {
    prev[meshCode] = apiResponse;
    return prev;
  }, {});
};
