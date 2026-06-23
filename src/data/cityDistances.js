const DISTANCES = {
  'Pune-Delhi': 1415, 'Delhi-Pune': 1415,
  'Pune-Mumbai': 149, 'Mumbai-Pune': 149,
  'Pune-Chennai': 1175, 'Chennai-Pune': 1175,
  'Pune-Bangalore': 835, 'Bangalore-Pune': 835,
  'Pune-Kolkata': 1870, 'Kolkata-Pune': 1870,
  'Pune-Hyderabad': 560, 'Hyderabad-Pune': 560,
  'Pune-Ahmedabad': 510, 'Ahmedabad-Pune': 510,
  'Mumbai-Delhi': 1148, 'Delhi-Mumbai': 1148,
  'Mumbai-Chennai': 1330, 'Chennai-Mumbai': 1330,
  'Mumbai-Bangalore': 988, 'Bangalore-Mumbai': 988,
  'Mumbai-Kolkata': 2052, 'Kolkata-Mumbai': 2052,
  'Mumbai-Hyderabad': 710, 'Hyderabad-Mumbai': 710,
  'Mumbai-Ahmedabad': 524, 'Ahmedabad-Mumbai': 524,
  'Delhi-Chennai': 2194, 'Chennai-Delhi': 2194,
  'Delhi-Bangalore': 2150, 'Bangalore-Delhi': 2150,
  'Delhi-Kolkata': 1477, 'Kolkata-Delhi': 1477,
  'Delhi-Hyderabad': 1580, 'Hyderabad-Delhi': 1580,
  'Delhi-Ahmedabad': 930, 'Ahmedabad-Delhi': 930,
  'Chennai-Bangalore': 347, 'Bangalore-Chennai': 347,
  'Chennai-Hyderabad': 630, 'Hyderabad-Chennai': 630,
  'Kolkata-Chennai': 1678, 'Chennai-Kolkata': 1678,
  'Bangalore-Hyderabad': 575, 'Hyderabad-Bangalore': 575,
  'Nagpur-Mumbai': 876, 'Mumbai-Nagpur': 876,
  'Nagpur-Delhi': 1092, 'Delhi-Nagpur': 1092,
  'Nagpur-Pune': 705, 'Pune-Nagpur': 705,
  'Jaipur-Delhi': 268, 'Delhi-Jaipur': 268,
  'Jaipur-Mumbai': 1137, 'Mumbai-Jaipur': 1137,
  'Ahmedabad-Surat': 265, 'Surat-Ahmedabad': 265,
  'Goa-Mumbai': 594, 'Mumbai-Goa': 594,
  'Goa-Pune': 452, 'Pune-Goa': 452,
  'Lucknow-Delhi': 558, 'Delhi-Lucknow': 558,
  'Lucknow-Mumbai': 1400, 'Mumbai-Lucknow': 1400,
  'Chandigarh-Delhi': 250, 'Delhi-Chandigarh': 250,
  'Bhopal-Delhi': 775, 'Delhi-Bhopal': 775,
  'Bhopal-Mumbai': 852, 'Mumbai-Bhopal': 852,
}

export function getCityDistance(from, to) {
  const key = `${from}-${to}`
  return DISTANCES[key] || 500
}

export const MAJOR_CITIES = [
  'Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Chennai',
  'Hyderabad', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Nagpur',
  'Surat', 'Goa', 'Lucknow', 'Chandigarh', 'Bhopal',
]
