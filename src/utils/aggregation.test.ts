import { QueryResponse } from "./api";
import { aggregateData } from "./aggregation";

test("should aggregate data by month", () => {
  const queryResponse: QueryResponse = {
    "111": [
      ["2001-01-01", 1, 10, null, null, null, null],
      ["2001-01-02", 2, 12, null, null, null, null],
      ["2001-01-03", 3, 17, null, null, null, null],
      ["2001-02-01", 2, 11, null, null, null, null],
      ["2001-02-02", 3, 14, null, null, null, null],
      ["2001-02-03", 4, 17, null, null, null, null],
    ],
  };
  const result = aggregateData({
    queryResponse,
    averageScope: "month",
    separatorType: "json",
  });
  expect(result).toEqual([
    {
      gridcode: "111",
      year: 2001,
      month: 1,
      tm: 2,
      pr: 13,
      tn: null,
      sr: null,
      tx: null,
      sd: null,
    },
    {
      gridcode: "111",
      year: 2001,
      month: 2,
      tm: 3,
      pr: 14,
      tn: null,
      sr: null,
      tx: null,
      sd: null,
    },
  ]);
});

test("should aggregate data by year", () => {
  const queryResponse: QueryResponse = {
    "111": [
      ["2001-1-1", 1, 10, null, null, null, null],
      ["2001-1-2", 2, 12, null, null, null, null],
      ["2001-1-3", 3, 17, null, null, null, null],
      ["2002-2-1", 2, 11, null, null, null, null],
      ["2002-2-2", 3, 14, null, null, null, null],
      ["2002-2-3", 4, 17, null, null, null, null],
    ],
  };
  const result = aggregateData({
    queryResponse,
    averageScope: "year",
    separatorType: "json",
  });
  expect(result).toEqual([
    {
      gridcode: "111",
      year: 2001,
      tm: 2,
      pr: 13,
      tn: null,
      sr: null,
      tx: null,
      sd: null,
    },
    {
      gridcode: "111",
      year: 2002,
      tm: 3,
      pr: 14,
      tn: null,
      sr: null,
      tx: null,
      sd: null,
    },
  ]);
});

test("should aggregate data by gridcode", () => {
  const queryResponse: QueryResponse = {
    "111": [
      ["2001-01-01", 1, 10, null, null, null, null],
      ["2001-01-02", 2, 12, null, null, null, null],
      ["2001-01-03", 3, 17, null, null, null, null],
    ],
    "222": [
      ["2001-01-01", 2, 11, null, null, null, null],
      ["2001-01-02", 3, 14, null, null, null, null],
      ["2001-01-03", 4, 17, null, null, null, null],
    ],
  };

  const result = aggregateData({
    queryResponse,
    averageScope: "month",
    separatorType: "json",
  });
  expect(result).toEqual([
    {
      gridcode: "111",
      year: 2001,
      month: 1,
      tm: 2,
      pr: 13,
      tn: null,
      sr: null,
      tx: null,
      sd: null,
    },
    {
      gridcode: "222",
      year: 2001,
      month: 1,
      tm: 3,
      pr: 14,
      tn: null,
      sr: null,
      tx: null,
      sd: null,
    },
  ]);
});

test("should aggregate data as csv by gridcode", () => {
  const queryResponse: QueryResponse = {
    "111": [
      ["2001-01-01", 1, 10, null, null, null, null],
      ["2001-01-02", 2, 12, null, null, null, null],
      ["2001-01-03", 3, 17, null, null, null, null],
    ],
    "222": [
      ["2001-01-01", 2, 11, null, null, null, null],
      ["2001-01-02", 3, 14, null, null, null, null],
      ["2001-01-03", 4, 17, null, null, null, null],
    ],
  };

  const result = aggregateData({
    queryResponse,
    averageScope: "month",
    separatorType: "csv",
  });
  const csv = [
    "gridcode,year,month,tm,pr,tn,sr,tx,sd",
    "111,2001,1,2,13,null,null,null,null",
    "222,2001,1,3,14,null,null,null,null",
  ].join("\n");
  expect(result).toEqual(csv);
});
