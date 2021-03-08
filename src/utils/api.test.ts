import { _queryData } from "./api";
import fetch from "node-fetch";
type Fetch = typeof fetch;

const dummyPerYearPerMcode = [
  ["3-1", 5.3, 2.1, 1.2, 3.7, 1.5, 1.2],
  ["4-2", 5.3, 2.1, 1.2, 3.7, 1.5, 1.2],
  ["5-3", 5.3, 2.1, 1.2, 3.7, 1.5, 1.2],
];

const mockFetch = (_0: string) => {
  return new Promise<{
    ok: boolean;
    json: () => Promise<(string | number)[][]>;
  }>((resolve) => {
    resolve({
      ok: true,
      json: () =>
        new Promise((resolve) => {
          return resolve(dummyPerYearPerMcode);
        }),
    });
  });
};
const queryData = _queryData(mockFetch as Fetch);

test("should query data", async () => {
  const result = await queryData({
    startYear: 2015,
    startMonth: 2,
    endYear: 2017,
    endMonth: 3,
    meshCodes: ["11111111", "11111112"],
  });
  expect(result).toEqual({
    "11111111": {
      "2015": dummyPerYearPerMcode,
      "2016": dummyPerYearPerMcode,
      "2017": [dummyPerYearPerMcode[0]],
    },
    "11111112": {
      "2015": dummyPerYearPerMcode,
      "2016": dummyPerYearPerMcode,
      "2017": [dummyPerYearPerMcode[0]],
    },
  });
});
