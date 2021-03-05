import {
  validateAverageScope,
  validateDateRange,
  validateGeographicalRange,
  aggregateData,
  APIResponse,
} from './utils'

test('should validate date range', () => {
  const result = validateDateRange({sy: '2000', sm: '1', ey: '2001', em: '05'})
  if(!result) {
    throw new Error('invalid')
  } else {
    const {startYear, endYear, startMonth, endMonth} = result
    expect(startYear).toEqual(2000)
    expect(endYear).toEqual(2001)
    expect(startMonth).toEqual(1)
    expect(endMonth).toEqual(5)
  }
})

test('should not validate date range', () => {
  const result = validateDateRange({sy: '2010', sm: '1', ey: '2001', em: '05'})
  expect(result).toBe(false)
})

test('should validate geographical range', () => {
  const result = validateGeographicalRange({mcode: '60417050'})
  expect(result).toEqual({meshCode: '60417050'})
})

test('should not validate geographical range', () => {
  const result = validateGeographicalRange({mcode: 'aaaaa'})
  expect(result).toEqual(false)
})

test('should validate average scope', () => {
  const result = validateAverageScope({average: 'month'})
  expect(result).toEqual({averageScope: 'month'})
})

test('should not validate average scope', () => {
  const result = validateAverageScope({average: 'bbbbb'})
  expect(result).toEqual(false)
})

test('should aggregate data by month', () => {
  const data: APIResponse[] = [
    ['2001-01-01', 1, 10, null, null, null, null],
    ['2001-01-02', 2, 12, null, null, null, null],
    ['2001-01-03', 3, 17, null, null, null, null],
    ['2001-02-01', 2, 11, null, null, null, null],
    ['2001-02-02', 3, 14, null, null, null, null],
    ['2001-02-03', 4, 17, null, null, null, null],
  ]
  const result = aggregateData(data, '111', 'month')
  expect(result).toEqual(
    [
      { gridcode: '111', year: 2001, month: 1, tm: 2, pr: 13 },
      { gridcode: '111', year: 2001, month: 2, tm: 3, pr: 14 },
    ]
  )
})

test('should aggregate data by year', () => {
  const data: APIResponse[] = [
    [ '2001-1-1', 1, 10, null, null, null, null ],
    [ '2001-1-2', 2, 12, null, null, null, null ],
    [ '2001-1-3', 3, 17, null, null, null, null ],
    [ '2002-2-1', 2, 11, null, null, null, null ],
    [ '2002-2-2', 3, 14, null, null, null, null ],
    [ '2002-2-3', 4, 17, null, null, null, null ],
  ]
  const result = aggregateData(data, '111', 'year')
  expect(result).toEqual(
    [
      { gridcode: '111', year: 2001, tm: 2, pr: 13 },
      { gridcode: '111', year: 2002, tm: 3, pr: 14 },
    ]
  )
})

test('should aggregate data by gridcode', () => {
  const data1:APIResponse[] = [
    ['2001-01-01',1, 10, null, null, null, null],
    ['2001-01-02',2, 12, null, null, null, null],
    ['2001-01-03',3, 17, null, null, null, null],
  ]

  const data2: APIResponse[] = [
    ['2001-01-01',2, 11, null, null, null, null],
    ['2001-01-02',3, 14, null, null, null, null],
    ['2001-01-03',4, 17, null, null, null, null],
  ]

  const result1 = aggregateData(data1, '111', 'month')
  const result2 = aggregateData(data2, '222', 'month')
  expect(result1).toEqual(
    [
      { gridcode: '111', year: 2001, month: 1, tm: 2, pr: 13 },
    ]
  )
  expect(result2).toEqual(
    [
      { gridcode: '222', year: 2001, month: 1, tm: 3, pr: 14 },
    ]
  )
})
