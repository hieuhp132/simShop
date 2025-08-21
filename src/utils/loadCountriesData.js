import { countryDataMap } from '../assets/data/adjusted/countryDataIndex.js';

export function loadCountryData(countryName) {
  const key = countryName.toLowerCase();
  if (!countryDataMap[key]) {
    console.error(`Không tìm thấy dữ liệu cho quốc gia: ${countryName}`);
    return null;
  }
  return countryDataMap[key];
}
