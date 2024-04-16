from math import acos, cos, sin, pi


class gps:
    def __init__(self, latitude: float, longitude: float):
        if longitude < -180.0 or longitude > 180.0 or \
           latitude < -90.0 or latitude > 90.0:
            raise (ValueError(f"wrong set of latitude, longitude \
which are {latitude}, {longitude}"))
        self.longitude = longitude
        self.lg = longitude * pi / 180
        self.latitude = latitude
        self.lt = latitude * pi / 180

    def DMS_latitude(self):
        angle = int(self.latitude)
        minutes = int((self.latitude - angle) * 60)
        hundred_times = 100 * self.latitude
        seconds = int((hundred_times - int(hundred_times)) * 60)
        return ({"angle": angle, "minutes": minutes, "seconds": seconds})

    def DMS_longitude(self):
        angle = int(self.longitude)
        minutes = int((self.longitude - angle) * 60)
        hundred_times = 100 * self.longitude
        seconds = int((hundred_times - int(hundred_times)) * 60)
        return ({"angle": angle, "minutes": minutes, "seconds": seconds})

    def distance(self, other):
        acos(sin(self.lt) * sin(other.lt) +
             cos(self.lt) * cos(other.lt) * cos(other.lg - self.lg)) * 6371

    def __str__(self):
        return f"Latitude: {self.latitude}, Longitude: {self.longitude}"


def gps_distance(a: gps, b: gps):
    """Returns the distance between two gps position
    """
    a.distance(b)
