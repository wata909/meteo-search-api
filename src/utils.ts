import util from 'util'

export const errorResponse = (statusCode: number, message: string, ...variables: string[]) => {
  return {
      statusCode,
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': 'x-access-token',
      },
      body: JSON.stringify({
          message: util.format(message, ...variables)
      })
  }
}

type DateParams = {
  sy: string | undefined,
  ey: string | undefined,
  sm: string | undefined,
  em: string | undefined,
}

type GeographicalParams = {
  mcode: string | undefined,
}

type AverageScopeParams = {
  average: string | undefined
}

type AverageScope = 'day' | 'month' | 'year'

type QueryDataParams = {
  startYear: number,
  endYear: number,
  startMonth: number,
  endMonth: number,
  meshCode: string
}

type APIResponse = {
  gridcode: string,
  year: number,
  month: number,
  day: number,
  tm: number,
  pr: number
}
type AggregationDeployMap = { [key: string]: {
  tm_sum: number,
  pr_sum: number,
  count: number,
} }

export const validateDateRange = ({sy, ey, sm, em}: DateParams) => {
  if(!sy || !ey || !sm || !em) {
    return false
  }
  const startYear = parseInt(sy, 10)
  const endYear = parseInt(ey, 10)
  const startMonth = parseInt(sm, 10)
  const endMonth = parseInt(em, 10)

  if(
      Number.isNaN(startYear) ||
      Number.isNaN(endYear) ||
      Number.isNaN(startMonth) ||
      Number.isNaN(endMonth)
  ) {
    return false
  }
  if(startMonth < 1 || 12 < startMonth || endMonth < 1 || 12 < endMonth) {
    return false
  }
  if(startYear + startMonth / 100 > endYear + endMonth / 100) {
    return false
  }
  return { startYear, endYear, startMonth, endMonth }
}

export const validateGeographicalRange = ({mcode}: GeographicalParams) => {
  if(!mcode || !mcode.match(/[0-9]{7}/)) {
    return false
  }
  return { meshCode: mcode }
}

export const validateAverageScope = ({average}: AverageScopeParams) => {
  if(!average) {
    return {averageScope: 'day' as 'day'}
  } else if(average.toUpperCase() === 'MONTH') {
    return {averageScope: 'month' as 'month'}
  } else if(average.toUpperCase() === 'YEAR') {
    return {averageScope: 'year' as 'year'}
  }
  return false
}

export const queryData = async (query: QueryDataParams): Promise<APIResponse[]> => {
  // NOTE: This is a mock.
  return [{
    gridcode: "53396111",
    year: 2015,
    month: 3,
    day: 1,
    tm: 5.3,
    pr: 2.1
  }]
}

export const aggregateData = (data: APIResponse[], averageScope: AverageScope) => {
  if(averageScope === 'day') {
    return data
  } else {
    const deployMap = data.reduce<AggregationDeployMap>((prev, item) => {
      const key = averageScope === 'month' ? `${item.gridcode}/${item.year}/${item.month}` : `${item.gridcode}/${item.year}`
      if(!prev[key]) {
        prev[key] = {tm_sum: 0, pr_sum: 0, count: 0}
      }
      prev[key].tm_sum += item.tm
      prev[key].pr_sum += item.pr
      prev[key].count++
      return prev
    }, {})

    return Object.keys(deployMap).map(key => {
      const [gridcode, year, month] = key.split('/')
      const deployment = deployMap[key]
      return {
        gridcode,
        year: parseInt(year, 10), // !isNaN
        month: averageScope === 'month' ? parseInt(month, 10) : void 0, // !isNaN
        tm: deployment.tm_sum / deployment.count,
        pr: deployment.pr_sum / deployment.count
      }
    })
  }
}
