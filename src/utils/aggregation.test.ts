import { QueryResponse } from "./api";
import { aggregateData } from "./aggregation";

test("should filter by element tm", () => {
  const queryResponse: QueryResponse = {
    "36225717": {
      "1978": [["01-01", 18.6, 19.5, 17.4, 2, 3.5, 1]],
    },
  };
  const result = aggregateData({
    queryResponse,
    elementScope: {
      tm: true,
      tx: false,
      tn: false,
      pr: false,
      sr: false,
      sd: false,
    },
    averageScope: "day",
    separatorType: "json",
  });
  expect(result).toEqual([
    {
      gridcode: "36225717",
      year: 1978,
      month: 1,
      day: 1,
      tm: 18.6,
      tx: void 0,
      tn: void 0,
      pr: void 0,
      sr: void 0,
      sd: void 0,
    },
  ]);
});

test("should filter by element pr", () => {
  const queryResponse: QueryResponse = {
    "36225717": {
      "1978": [["01-01", 18.6, 19.5, 17.4, 2, 3.5, 1]],
    },
  };
  const result = aggregateData({
    queryResponse,
    elementScope: {
      tm: false,
      tx: false,
      tn: false,
      pr: true,
      sr: false,
      sd: false,
    },
    averageScope: "day",
    separatorType: "json",
  });
  expect(result).toEqual([
    {
      gridcode: "36225717",
      year: 1978,
      month: 1,
      day: 1,
      tm: void 0,
      tx: void 0,
      tn: void 0,
      pr: 2,
      sr: void 0,
      sd: void 0,
    },
  ]);
});

test("should filter by element tn", () => {
  const queryResponse: QueryResponse = {
    "36225717": {
      "1978": [["01-01", 18.6, 19.5, 17.4, 2, 3.5, 1]],
    },
  };
  const result = aggregateData({
    queryResponse,
    elementScope: {
      tm: false,
      tx: false,
      tn: true,
      pr: false,
      sr: false,
      sd: false,
    },
    averageScope: "day",
    separatorType: "json",
  });
  expect(result).toEqual([
    {
      gridcode: "36225717",
      year: 1978,
      month: 1,
      day: 1,
      tm: void 0,
      tx: void 0,
      tn: 17.4,
      pr: void 0,
      sr: void 0,
      sd: void 0,
    },
  ]);
});

test("should filter by element sr", () => {
  const queryResponse: QueryResponse = {
    "36225717": {
      "1978": [["01-01", 18.6, 19.5, 17.4, 2, 3.5, 1]],
    },
  };
  const result = aggregateData({
    queryResponse,
    elementScope: {
      tm: false,
      tx: false,
      tn: false,
      pr: false,
      sr: true,
      sd: false,
    },
    averageScope: "day",
    separatorType: "json",
  });
  expect(result).toEqual([
    {
      gridcode: "36225717",
      year: 1978,
      month: 1,
      day: 1,
      tm: void 0,
      tx: void 0,
      tn: void 0,
      pr: void 0,
      sr: 3.5,
      sd: void 0,
    },
  ]);
});

test("should filter by element tx", () => {
  const queryResponse: QueryResponse = {
    "36225717": {
      "1978": [["01-01", 18.6, 19.5, 17.4, 2, 3.5, 1]],
    },
  };
  const result = aggregateData({
    queryResponse,
    elementScope: {
      tm: false,
      tx: true,
      tn: false,
      pr: false,
      sr: false,
      sd: false,
    },
    averageScope: "day",
    separatorType: "json",
  });
  expect(result).toEqual([
    {
      gridcode: "36225717",
      year: 1978,
      month: 1,
      day: 1,
      tm: void 0,
      tx: 19.5,
      tn: void 0,
      pr: void 0,
      sr: void 0,
      sd: void 0,
    },
  ]);
});

test("should filter by element sd", () => {
  const queryResponse: QueryResponse = {
    "36225717": {
      "1978": [["01-01", 18.6, 19.5, 17.4, 2, 3.5, 1]],
    },
  };
  const result = aggregateData({
    queryResponse,
    elementScope: {
      tm: false,
      tx: false,
      tn: false,
      pr: false,
      sr: false,
      sd: true,
    },
    averageScope: "day",
    separatorType: "json",
  });
  expect(result).toEqual([
    {
      gridcode: "36225717",
      year: 1978,
      month: 1,
      day: 1,
      tm: void 0,
      tx: void 0,
      tn: void 0,
      pr: void 0,
      sr: void 0,
      sd: 1,
    },
  ]);
});

test("should filter by element", () => {
  const queryResponse: QueryResponse = {
    "111": {
      2001: [
        ["01-01", 1, null, 10, null, null, null],
        ["01-02", 2, null, 12, null, null, null],
        ["01-03", 3, null, 17, null, null, null],
        ["02-01", 2, null, 11, null, null, null],
        ["02-02", 3, null, 14, null, null, null],
        ["02-03", 4, null, 17, null, null, null],
      ],
    },
  };
  const result = aggregateData({
    queryResponse,
    elementScope: { tm: true, pr: false, tn: true },
    averageScope: "month",
    separatorType: "json",
  });
  expect(result).toEqual([
    {
      gridcode: "111",
      year: 2001,
      month: 1,
      tm: 2,
      tn: 13,
    },
    {
      gridcode: "111",
      year: 2001,
      month: 2,
      tm: 3,
      tn: 14,
    },
  ]);
});

test("should aggregate data by month", () => {
  const queryResponse: QueryResponse = {
    "111": {
      2001: [
        ["01-01", 1, 10, null, null, null, null],
        ["01-02", 2, 12, null, null, null, null],
        ["01-03", 3, 17, null, null, null, null],
        ["02-01", 2, 11, null, null, null, null],
        ["02-02", 3, 14, null, null, null, null],
        ["02-03", 4, 17, null, null, null, null],
      ],
    },
  };
  const result = aggregateData({
    queryResponse,
    elementScope: { tm: true, tx: true },
    averageScope: "month",
    separatorType: "json",
  });
  expect(result).toEqual([
    {
      gridcode: "111",
      year: 2001,
      month: 1,
      tm: 2,
      tx: 13,
    },
    {
      gridcode: "111",
      year: 2001,
      month: 2,
      tm: 3,
      tx: 14,
    },
  ]);
});

test("should aggregate data by year", () => {
  const queryResponse: QueryResponse = {
    "111": {
      2001: [
        ["1-1", 1, 10, null, null, null, null],
        ["1-2", 2, 12, null, null, null, null],
        ["1-3", 3, 17, null, null, null, null],
      ],
      2002: [
        ["2-1", 2, 11, null, null, null, null],
        ["2-2", 3, 14, null, null, null, null],
        ["2-3", 4, 17, null, null, null, null],
      ],
    },
  };
  const result = aggregateData({
    queryResponse,
    elementScope: { tm: true, tx: true },
    averageScope: "year",
    separatorType: "json",
  });
  expect(result).toEqual([
    {
      gridcode: "111",
      year: 2001,
      tm: 2,
      tx: 13,
    },
    {
      gridcode: "111",
      year: 2002,
      tm: 3,
      tx: 14,
    },
  ]);
});

test("should aggregate data by gridcode", () => {
  const queryResponse: QueryResponse = {
    "111": {
      2001: [
        ["01-01", 1, 10, null, null, null, null],
        ["01-02", 2, 12, null, null, null, null],
        ["01-03", 3, 17, null, null, null, null],
      ],
    },
    "222": {
      2001: [
        ["01-01", 2, 11, null, null, null, null],
        ["01-02", 3, 14, null, null, null, null],
        ["01-03", 4, 17, null, null, null, null],
      ],
    },
  };

  const result = aggregateData({
    queryResponse,
    elementScope: {
      tm: true,
      tx: true,
      tn: false,
      pr: false,
      sr: false,
      sd: false,
    },
    averageScope: "month",
    separatorType: "json",
  });
  expect(result).toEqual([
    {
      gridcode: "111",
      year: 2001,
      month: 1,
      tm: 2,
      tx: 13,
    },
    {
      gridcode: "222",
      year: 2001,
      month: 1,
      tm: 3,
      tx: 14,
    },
  ]);
});

test("should aggregate data as csv by gridcode", () => {
  const queryResponse: QueryResponse = {
    "111": {
      "2001": [
        ["01-01", 1, 10, null, null, null, null],
        ["01-02", 2, 12, null, null, null, null],
        ["01-03", 3, 17, null, null, null, null],
      ],
    },
    "222": {
      2001: [
        ["01-01", 2, 11, null, null, null, null],
        ["01-02", 3, 14, null, null, null, null],
        ["01-03", 4, 17, null, null, null, null],
      ],
    },
  };

  const result = aggregateData({
    queryResponse,
    elementScope: { tm: true, tx: true },
    averageScope: "month",
    separatorType: "csv",
  });
  const csv = [
    "gridcode,year,month,tm,tx",
    "111,2001,1,2,13",
    "222,2001,1,3,14",
  ].join("\n");
  expect(result).toEqual(csv);
});

test.only("should round to 3 significant digits", () => {
  const queryResponse: QueryResponse = {
    "222": {
      2001: [
        ["01-01", 2, 11, null, null, null, null],
        ["01-02", 3, 14, null, null, null, null],
        ["01-03", 3, 16, null, null, null, null],
      ],
    },
  };
  const result = aggregateData({
    queryResponse,
    elementScope: { tm: true, tx: true },
    averageScope: "month",
    separatorType: "json",
  });
  expect(result).toEqual([
    {
      gridcode: "222",
      year: 2001,
      month: 1,
      tm: 2.667,
      tx: 13.667,
    },
  ]);
});
