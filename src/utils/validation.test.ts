import {
  validateAverageScope,
  validateDateRange,
  validateGeographicalRange,
  validateElementScope,
  validateSeparatorTypes,
} from "./validation";

describe("date range", () => {
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

  test("should validate date range without end year", () => {
    const result = validateDateRange({
      sy: "2000",
      sm: "1",
      em: "12",
    });
    if (!result) {
      throw new Error("invalid");
    } else {
      const { startYear, endYear, startMonth, endMonth } = result;
      expect(startYear).toEqual(2000);
      expect(endYear).toEqual(2000);
      expect(startMonth).toEqual(1);
      expect(endMonth).toEqual(12);
    }
  });

  test("should validate date range without end year and end month", () => {
    const result = validateDateRange({
      sy: "2000",
      sm: "2",
    });
    if (!result) {
      throw new Error("invalid");
    } else {
      const { startYear, endYear, startMonth, endMonth } = result;
      expect(startYear).toEqual(2000);
      expect(endYear).toEqual(2000);
      expect(startMonth).toEqual(2);
      expect(endMonth).toEqual(12);
    }
  });

  test("should validate date range without month", () => {
    const result = validateDateRange({
      sy: "2000",
      ey: "2001",
    });
    if (!result) {
      throw new Error("invalid");
    } else {
      const { startYear, endYear, startMonth, endMonth } = result;
      expect(startYear).toEqual(2000);
      expect(endYear).toEqual(2001);
      expect(startMonth).toEqual(1);
      expect(endMonth).toEqual(12);
    }
  });

  test("should validate date range only with a start year", () => {
    const result = validateDateRange({
      sy: "2000",
    });
    if (!result) {
      throw new Error("invalid");
    } else {
      const { startYear, endYear, startMonth, endMonth } = result;
      expect(startYear).toEqual(2000);
      expect(endYear).toEqual(2000);
      expect(startMonth).toEqual(1);
      expect(endMonth).toEqual(12);
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

  test("should not validate reversed date range", () => {
    const result = validateDateRange({
      sy: "2010",
      sm: "1",
      ey: "2001",
      em: "05",
    });
    expect(result).toBe(false);
  });

  test("should not validate only with with end year", () => {
    const result = validateDateRange({
      ey: "2001",
    });
    expect(result).toBe(false);
  });

  test("should not validate only with with end year", () => {
    const result = validateDateRange({
      sm: "1",
      em: "12",
    });
    expect(result).toBe(false);
  });

  test("should not validate without any date param", () => {
    const result = validateDateRange({});
    expect(result).toBe(false);
  });

  test("should not validate only with invalid date range", () => {
    const result = validateDateRange({
      sy: "hello",
      sm: "1",
      em: "12",
    });
    expect(result).toBe(false);
  });
});

describe("geographical range", () => {
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

  test("should not validate if invalid code contaminated", () => {
    const result = validateGeographicalRange({
      mcode: "60417050,hello,12345678",
    });
    expect(result).toEqual(false);
  });

  test("should not validate empty geographical", () => {
    const result = validateGeographicalRange({ mcode: void 0 });
    expect(result).toEqual(false);
  });
});

describe("average scope", () => {
  test("should validate average scope", () => {
    const result = validateAverageScope({ average: "month" });
    expect(result).toEqual({ averageScope: "month" });
  });

  test("should validate empty average scope as default", () => {
    const result = validateAverageScope({ average: void 0 });
    expect(result).toEqual({ averageScope: "day" });
  });

  test("should not validate average scope", () => {
    const result = validateAverageScope({ average: "bbbbb" });
    expect(result).toEqual(false);
  });
});

describe("element scope", () => {
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

  test("should not validate empty element as default", () => {
    const result = validateElementScope({ element: void 0 });
    expect(result).toEqual(false);
  });

  test("should not validate invalid elements", () => {
    const result = validateElementScope({ element: "tm,pr,hoge,sr,fuga,sd" });
    expect(result).toEqual(false);
  });

  test("should not validate only with invalid elements", () => {
    const result = validateElementScope({ element: "hoge,fuga" });
    expect(result).toEqual(false);
  });
});

describe("separator", () => {
  test("should validate separator scope", () => {
    const result = validateSeparatorTypes({ separator: "csv" });
    expect(result).toEqual({ separatorType: "csv" });
  });

  test("should validate empty separator scope as default", () => {
    const result = validateSeparatorTypes({ separator: void 0 });
    expect(result).toEqual({ separatorType: "json" });
  });

  test("should not validate separator scope", () => {
    const result = validateSeparatorTypes({ separator: "foo" });
    expect(result).toEqual(false);
  });
});
