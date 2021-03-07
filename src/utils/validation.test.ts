import {
  validateAverageScope,
  validateDateRange,
  validateGeographicalRange,
  validateElementScope,
  validateSeparatorTypes,
} from "./validation";

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

test("should validate element scope", () => {
  const result = validateElementScope({ element: "tm,pr,tn" });
  expect(result).toEqual({
    elementScope: {
      tm: true,
      pr: true,
      tn: true,
      sr: false,
      tx: false,
      sd: false,
    },
  });
});

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
