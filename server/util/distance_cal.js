function getDistance(xA, yA, xB, yB) {
  let xDiff = xA - xB;
  let yDiff = yA - yB;

  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

function fourEndPointsDiff(lat1, long1, lat2, long2, lat3, long3, lat4, long4) {
  return (
    getDistance(lat1, long1, lat3, long3) +
    getDistance(lat2, long2, lat4, long4)
  );
}

module.exports = {
  getDistance,
  fourEndPointsDiff
};
