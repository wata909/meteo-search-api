import {
  validateAverageScope,
  validateDateRange,
  validateGeographicalRange,
  validateElementScope,
  validateSeparatorTypes,
  aggregateData,
  QueryResponse,
} from "./utils";

test("should validate date range", () => {
  const result = validateDateRange({
    sy: "2000",
    sm: "1",
    ey: "2001",
    em: "05",
  });
  if (!result) {
    throw new Error("invalid");
  } else {
    const { startYear, endYear, startMonth, endMonth } = result;
    expect(startYear).toEqual(2000);
    expect(endYear).toEqual(2001);
    expect(startMonth).toEqual(1);
    expect(endMonth).toEqual(5);
  }
});

test("should not validate date range", () => {
  const result = validateDateRange({
    sy: "2010",
    sm: "1",
    ey: "2001",
    em: "05",
  });
  expect(result).toBe(false);
});

test("should validate geographical range", () => {
  const result = validateGeographicalRange({ mcode: "60417050" });
  expect(result).toEqual({ meshCodes: ["60417050"] });
});
test("should validate multiple geographical range", () => {
  const result = validateGeographicalRange({ mcode: "60417050,60417051" });
  expect(result).toEqual({ meshCodes: ["60417050", "60417051"] });
});

test("should not validate geographical range", () => {
  const result = validateGeographicalRange({ mcode: "aaaaa" });
  expect(result).toEqual(false);
});

test("should validate average scope", () => {
  const result = validateAverageScope({ average: "month" });
  expect(result).toEqual({ averageScope: "month" });
});

test('should validate element scope', () => {
  const result = validateElementScope({ element: 'tm,pr,tn' })
  expect(result).toEqual({elementScope: {
    tm: true,
    pr: true,
    tn: true,
    sr: false,
    tx: false,
    sd: false,
  }})
})

test("should not validate average scope", () => {
  const result = validateAverageScope({ average: "bbbbb" });
  expect(result).toEqual(false);
});

test("should validate separator scope", () => {
  const result = validateSeparatorTypes({ separator: "csv" });
  expect(result).toEqual({ separatorType: "csv" });
});

test("should not validate separator scope", () => {
  const result = validateSeparatorTypes({ separator: "foo" });
  expect(result).toEqual(false);
});

test("should aggregate data by month", () => {
  const data: QueryResponse = {
    "111": [
      ["2001-01-01", 1, 10, null, null, null, null],
      ["2001-01-02", 2, 12, null, null, null, null],
      ["2001-01-03", 3, 17, null, null, null, null],
      ["2001-02-01", 2, 11, null, null, null, null],
      ["2001-02-02", 3, 14, null, null, null, null],
      ["2001-02-03", 4, 17, null, null, null, null],
    ],
  };
  const result = aggregateData(data, "month", "json");
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
  const data: QueryResponse = {
    "111": [
      ["2001-1-1", 1, 10, null, null, null, null],
      ["2001-1-2", 2, 12, null, null, null, null],
      ["2001-1-3", 3, 17, null, null, null, null],
      ["2002-2-1", 2, 11, null, null, null, null],
      ["2002-2-2", 3, 14, null, null, null, null],
      ["2002-2-3", 4, 17, null, null, null, null],
    ],
  };
  const result = aggregateData(data, "year", "json");
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
  const data: QueryResponse = {
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

  const result = aggregateData(data, "month", "json");
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
  const data: QueryResponse = {
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

  const result = aggregateData(data, "month", "csv");
  const csv = [
    "gridcode,year,month,tm,pr,tn,sr,tx,sd",
    "111,2001,1,2,13,null,null,null,null",
    "222,2001,1,3,14,null,null,null,null",
  ].join("\n");
  expect(result).toEqual(csv);
});
