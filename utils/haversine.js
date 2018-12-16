// Given two points on the Earth expressed as latitudes and longitudes, return the distance between them in KM
export function haversineDistance(lat1, lon1, lat2, lon2) {
    const deltaLon = (lon2 - lon1) * (Math.PI / 180)
    const deltaLat = (lat2 - lat1) * (Math.PI / 180)

    const v = Math.sin(deltaLat / 2) * Math.sin(deltaLon / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)
    const unitDistance = 2 * Math.atan2(Math.sqrt(v), Math.sqrt(1 - v))
    return 6371 * unitDistance //6371 = earth's radius in KM
}