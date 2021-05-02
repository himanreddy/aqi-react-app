export const getAQIIndexType = (aqi: number) => {
  if(aqi <= 50) return 'good';
  if(aqi > 50 && aqi <= 100) return 'satisfactory';
  if(aqi > 100 && aqi <= 200) return 'moderate';
  if(aqi > 200 && aqi <= 300) return 'poor';
  if(aqi > 300 && aqi <= 400) return 'very-poor';
  if(aqi > 400) return 'severe';
}