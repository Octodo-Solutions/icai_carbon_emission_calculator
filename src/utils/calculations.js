import { getCityDistance } from '../data/cityDistances'

export function calcElectricity(kwh, ef) {
  const factor = ef ?? 0.000716
  return parseFloat((kwh * factor).toFixed(6))
}

export function calcDGSet(litres, ef) {
  const factor = ef ?? 0.00268
  return parseFloat((litres * factor).toFixed(6))
}

export function calcAirTravel(from, to, trips, ef) {
  const factor = ef ?? 0.000255
  const oneWayKm = getCityDistance(from, to)
  return parseFloat((oneWayKm * 2 * trips * factor).toFixed(6))
}

export function calcRailTravel(from, to, trips, ef) {
  const factor = ef ?? 0.000012
  const oneWayKm = getCityDistance(from, to)
  return parseFloat((oneWayKm * 2 * trips * factor).toFixed(6))
}

export function calcRoadTravel(km, fuelType, efMap) {
  const defaults = { petrol: 0.000192, diesel: 0.000171, cng: 0.000155, ev: 0.000050 }
  const factors = efMap || defaults
  return parseFloat((km * (factors[fuelType] || defaults.petrol)).toFixed(6))
}

export function calcPaper(reams, wasteKg, efPaper, efWaste) {
  const fp = efPaper ?? 0.0045
  const fw = efWaste ?? 0.0005
  return parseFloat(((reams * fp) + (wasteKg * fw)).toFixed(6))
}

export function calcLPG(cylinders, ef) {
  const kgPerCyl = 14.2
  const factor = ef ?? 2.98
  return parseFloat((cylinders * kgPerCyl * factor / 1000).toFixed(6))
}

export function calcPNG(scm, ef) {
  const factor = ef ?? 0.00202
  return parseFloat((scm * factor / 1000).toFixed(6))
}

export function calcHotel(nights, category, efMap) {
  const defaults = { budget: 0.0189, mid: 0.0311, luxury: 0.0556 }
  const factors = efMap || defaults
  return parseFloat((nights * (factors[category] || defaults.mid)).toFixed(6))
}

export function calcScopeTotals(moduleData) {
  const s1 = (moduleData.dg?.tco2e || 0) + (moduleData.cooking?.tco2e || 0)
  const s2 = moduleData.electricity?.tco2e || 0
  const s3 = (moduleData.travel?.tco2e || 0) + (moduleData.paper?.tco2e || 0) + (moduleData.hotel?.tco2e || 0)
  const total = s1 + s2 + s3
  return {
    s1: parseFloat(s1.toFixed(4)),
    s2: parseFloat(s2.toFixed(4)),
    s3: parseFloat(s3.toFixed(4)),
    total: parseFloat(total.toFixed(4)),
  }
}

export function calcAirDistanceFromCities(from, to) {
  return getCityDistance(from, to) * 2
}
