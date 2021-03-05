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
  tm: number | null,
  pr: number | null,
  tn: number | null,
  sr: number | null,
  tx: number | null,
  sd: number | null,
}
type AggregationDeployMap = { [key: string]: {
  tm: { sum: number, count: number },
  pr: { sum: number, count: number },
  tn: { sum: number, count: number },
  sr: { sum: number, count: number },
  tx: { sum: number, count: number },
  sd: { sum: number, count: number },
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
  if(!average || average.toUpperCase() === 'DAY') {
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
    pr: 2.1,
    tn: 1.2,
    sr: 3.7,
    tx: 1.5,
    sd: 1.2
  }]
}

export const aggregateData = (data: APIResponse[], averageScope: AverageScope) => {
  if(averageScope === 'day') {
    return data
  } else {
    const deployMap = data.reduce<AggregationDeployMap>((prev, item) => {
      const key = averageScope === 'month' ? `${item.gridcode}/${item.year}/${item.month}` : `${item.gridcode}/${item.year}`
      if(!prev[key]) {
        prev[key] = {
          tm: {sum: 0,count: 0},
          pr: {sum: 0,count: 0},
          tn: {sum: 0,count: 0},
          sr: {sum: 0,count: 0},
          tx: {sum: 0,count: 0},
          sd: {sum: 0,count: 0},
        }
      }
      if(typeof item.tm === 'number') {
        prev[key].tm.sum += item.tm
        prev[key].tm.count++
      }
      if(typeof item.pr === 'number') {
        prev[key].pr.sum += item.pr
        prev[key].pr.count++
      }
      if(typeof item.tn === 'number') {
        prev[key].tn.sum += item.tn
        prev[key].tn.count++
      }
      if(typeof item.sr === 'number') {
        prev[key].sr.sum += item.sr
        prev[key].sr.count++
      }
      if(typeof item.tx === 'number') {
        prev[key].tx.sum += item.tx
        prev[key].tx.count++
      }
      if(typeof item.sd === 'number') {
        prev[key].sd.sum += item.sd
        prev[key].sd.count++
      }
      return prev
    }, {})

    return Object.keys(deployMap).map(key => {
      const [gridcode, year, month] = key.split('/')
      const deployment = deployMap[key]
      return {
        gridcode,
        year: parseInt(year, 10), // !isNaN
        month: averageScope === 'month' ? parseInt(month, 10) : void 0, // !isNaN
        tm: deployment.tm.count > 0 ? deployment.tm.sum / deployment.tm.count : void 0,
        pr: deployment.pr.count > 0 ? deployment.pr.sum / deployment.pr.count : void 0,
        tn: deployment.tn.count > 0 ? deployment.tn.sum / deployment.tn.count : void 0,
        sr: deployment.sr.count > 0 ? deployment.sr.sum / deployment.sr.count : void 0,
        tx: deployment.tx.count > 0 ? deployment.tx.sum / deployment.tx.count : void 0,
        sd: deployment.sd.count > 0 ? deployment.sd.sum / deployment.sd.count : void 0,
      }
    })
  }
}
