import { formatURL, listYears, listCombinations } from "./format";
import fetch from "node-fetch";

type Fetch = typeof fetch;

type QueryDataParams = {
  startYear: number;
  endYear: number;
  startMonth: number;
  endMonth: number;
  meshCodes: string[];
};

export type StaticAPIResponseItem = [
  d: string,
  tm: number | null,
  pr: number | null,
  tn: number | null,
  sr: number | null,
  tx: number | null,
  sd: number | null
];

export type QueryResponse = {
  [meshCode: string]: {
    [year: number]: StaticAPIResponseItem[];
  };
};

// DI container
export const _queryData = (fetch: Fetch, endpointFormat?: string) => async (
  query: QueryDataParams
): Promise<QueryResponse> => {
  const { startYear, endYear, startMonth, endMonth, meshCodes } = query;
  const years = listYears(startYear, endYear);

  const urlMeshCodeList = listCombinations(years, meshCodes)
    .map(({ year, meshCode }) => {
      const url = formatURL(year, meshCode, endpointFormat);
      if (!url) {
        return false;
      } else {
        return {
          year,
          meshCode,
          url,
        };
      }
    })
    .filter((item) => !!item) as {
    year: number;
    meshCode: string;
    url: string;
  }[];

  const result = await Promise.all(
    urlMeshCodeList.map(({ url }) =>
      fetch(url)
        .then((res) => {
          if (res.ok) {
            return res.json() as Promise<StaticAPIResponseItem[]>;
          } else {
            console.error({ url });
            throw new Error("Invalid static API Response");
          }
        })
        .catch((err) => {
          console.error(err);
          return false as const;
        })
    )
  );

  const meshCodeMap: QueryResponse = {};

  for (let index = 0; index < urlMeshCodeList.length; index++) {
    const { meshCode, year } = urlMeshCodeList[index];
    if (!meshCodeMap[meshCode]) {
      meshCodeMap[meshCode] = {};
    }
    if (!meshCodeMap[meshCode][year]) {
      meshCodeMap[meshCode][year] = [];
    }

    const eachResult = result[index];
    if (!eachResult) {
      continue;
    }

    // filter by year-month
    const staticResponse = eachResult.filter((item) => {
      const [monthString] = item[0].split("-");
      const month = parseInt(monthString, 10); // !isNaN
      return (
        startYear + startMonth / 100 <= year + month / 100 &&
        year + month / 100 <= endYear + endMonth / 100
      );
    });
    meshCodeMap[meshCode][year].push(...staticResponse);
  }

  return meshCodeMap;
};

// inject fetch
export const queryData = _queryData(fetch);
