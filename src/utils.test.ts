import {validateDateRange,validateGeographicalRange} from './utils'

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

