import { formatURL, listYears } from "./format";

test("should format URL from template", () => {
  const result = formatURL(2021, "36225717");
  expect(result).toEqual("https://example.com/2021/3622/362257/36225717.json");
});

test("should format URL with injected template", () => {
  const result = formatURL(
    2021,
    "36225717",
    "https://example.com/custom/%s/%s/%s/%s.json"
  );
  expect(result).toEqual(
    "https://example.com/custom/2021/3622/362257/36225717.json"
  );
});

test("should list years", () => {
  const result = listYears(2010, 2013);
  expect(result).toEqual([2010, 2011, 2012, 2013]);
});
