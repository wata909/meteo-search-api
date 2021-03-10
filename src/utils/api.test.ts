import { _queryData } from "./api";
import fetch from "node-fetch";
type Fetch = typeof fetch;

const dummyPerYearPerMcode = [
  ["3-1", 5.3, 2.1, 1.2, 3.7, 1.5, 1.2],
  ["4-2", 5.3, 2.1, 1.2, 3.7, 1.5, 1.2],
  ["5-3", 5.3, 2.1, 1.2, 3.7, 1.5, 1.2],
];

const successiveMockFetch = (url: string) => {
  return new Promise<{
    url: string;
    ok: boolean;
    json: () => Promise<(string | number)[][]>;
  }>((resolve) => {
    resolve({
      url,
      ok: true,
      json: () =>
        new Promise((resolve) => {
          return resolve(dummyPerYearPerMcode);
        }),
    });
  });
};
const failingMockFetch = (url: string) => {
  return new Promise<{
    url: string;
    ok: boolean;
    json: () => Promise<(string | number)[][]>;
  }>((resolve) => {
    resolve({
      url,
      ok: false,
      json: () =>
        new Promise((resolve) => {
          return resolve(dummyPerYearPerMcode);
        }),
    });
  });
};

const successiveQueryData = _queryData(successiveMockFetch as Fetch);
const failingQueryData = _queryData(failingMockFetch as Fetch);

test("should query data", async () => {
  const result = await successiveQueryData({
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

test("should throw", async () => {
  await expect(
    failingQueryData({
      startYear: 2015,
      startMonth: 2,
      endYear: 2017,
      endMonth: 3,
      meshCodes: ["11111111", "11111112"],
    })
  ).rejects.toThrow();
});
