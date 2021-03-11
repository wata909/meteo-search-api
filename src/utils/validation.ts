import { StaticAPIResponseItem } from "./api";

type DateParams = {
  sy?: string;
  ey?: string;
  sm?: string;
  em?: string;
};

type GeographicalParams = {
  mcode?: string;
};

type ElementScopeParams = {
  element?: string;
};

type AverageScopeParams = {
  average?: string;
};

type SeparatorTypesParams = {
  separator?: string;
};

export type ElementType = "tm" | "pr" | "tn" | "sr" | "tx" | "sd";

export type AverageScope = "day" | "month" | "year";

export type SeparatorType = "csv" | "json";

export type ElementScope = {
  [element in ElementType]?: boolean;
};

export type QueryResponse = {
  [meshCode: string]: StaticAPIResponseItem[];
};

export const allElementTypes: ElementType[] = [
  "tm",
  "pr",
  "tn",
  "sr",
  "tx",
  "sd",
];

export const validateDateRange = (
  dateParam: DateParams
):
  | false
  | {
      startYear: number;
      endYear: number;
      startMonth: number;
      endMonth: number;
    } => {
  const { sy, ey, sm, em } = {
    sy: dateParam.sy,
    ey: dateParam.ey || dateParam.sy,
    sm: dateParam.sm || "1",
    em: dateParam.em || "12",
  };
  if (!sy || !ey || !sm || !em) {
    return false;
  }
  const startYear = parseInt(sy, 10);
  const endYear = parseInt(ey, 10);
  const startMonth = parseInt(sm, 10);
  const endMonth = parseInt(em, 10);

  if (
    Number.isNaN(startYear) ||
    Number.isNaN(endYear) ||
    Number.isNaN(startMonth) ||
    Number.isNaN(endMonth)
  ) {
    return false;
  }
  if (startMonth < 1 || 12 < startMonth || endMonth < 1 || 12 < endMonth) {
    return false;
  }
  if (startYear + startMonth / 100 > endYear + endMonth / 100) {
    return false;
  }
  return { startYear, endYear, startMonth, endMonth };
};

export const validateGeographicalRange = ({
  mcode,
}: GeographicalParams): false | { meshCodes: string[] } => {
  if (!mcode || typeof mcode !== "string") {
    return false;
  }
  const meshCodes = mcode.split(",");
  if (meshCodes.some((meshCode) => !meshCode.match(/^[0-9]{8}$/))) {
    return false;
  }
  const uniqueMeshCodes = meshCodes.filter(
    (meshCode, index, self) => self.indexOf(meshCode) === index
  );
  return { meshCodes: uniqueMeshCodes };
};

export const validateElementScope = ({ element }: ElementScopeParams) => {
  let allowedElementTypes: ElementType[];
  if (!element) {
    return false;
  } else {
    const elements = element.split(",").filter((element, index, self) => {
      return self.indexOf(element) === index;
    });

    if (
      elements.some(
        (element) => !allElementTypes.includes(element as ElementType)
      )
    ) {
      return false;
    }

    allowedElementTypes = elements as ElementType[];
  }

  if (allowedElementTypes.length === 0) {
    return false;
  }

  const elementScope = allElementTypes.reduce<ElementScope>((prev, element) => {
    prev[element] = allowedElementTypes.includes(element);
    return prev;
  }, {});

  return { elementScope };
};

export const validateAverageScope = ({
  average,
}: AverageScopeParams): false | { averageScope: AverageScope } => {
  if (!average || average.toUpperCase() === "DAY") {
    return { averageScope: "day" as const };
  } else if (average.toUpperCase() === "MONTH") {
    return { averageScope: "month" as const };
  } else if (average.toUpperCase() === "YEAR") {
    return { averageScope: "year" as const };
  }
  return false;
};

export const validateSeparatorTypes = ({ separator }: SeparatorTypesParams) => {
  if (!separator || separator.toUpperCase() === "JSON") {
    return { separatorType: "json" as const };
  } else if (separator.toUpperCase() === "CSV") {
    return { separatorType: "csv" as const };
  }
  return false;
};
