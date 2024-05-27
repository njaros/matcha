from math import acos, cos, sin, pi
import requests
import ipaddress
from flask import current_app


class Dms:
    def __init__(self, angle: int, minutes: int, seconds: int):
        if (abs(angle), minutes, seconds) > (180, 0, 0):
            raise ValueError(
                f"set of values {(angle, minutes, seconds)} \
are out of border"
            )
        if minutes < 0 or seconds < 0 or minutes > 59 or seconds > 59:
            raise ValueError(
                f"(minutes, seconds) = {(minutes, seconds)} must be \
between 0 and 59"
            )
        self._angle = angle
        self._minutes = minutes
        self._seconds = seconds

    @property
    def angle(self):
        return self._angle

    @property
    def minutes(self):
        return self._minutes

    @property
    def seconds(self):
        return self._seconds

    def __str__(self):
        return f"{self.angle}° {self.minutes}' {self.seconds}''"

    def __lt__(self, other):
        if not isinstance(other, Dms):
            raise ValueError("Can't compare differents types of object")
        if self.angle < other.angle:
            return True
        if self.angle == other.angle:
            if self.minutes < other.minutes:
                return True
            if self.minutes == other.minutes:
                return self.seconds < other.seconds
        return False

    def __le__(self, other):
        return not other < self

    def __gt__(self, other):
        return other < self

    def __ge__(self, other):
        return not self < other

    def __eq__(self, other):
        if not isinstance(other, Dms):
            raise ValueError("Can't compare differents types of object")
        return (
            self.angle == other.angle
            and self.minutes == other.minutes
            and self.seconds == other.seconds
        )

    def __ne__(self, other):
        return not self == other

    def _abs(self):
        if self._angle < 0:
            return Dms(-self._angle, self._minutes, self._seconds)
        return self


class Gps:

    def __init__(self, latitude, longitude):
        if isinstance(latitude, (float, int)) and isinstance(
            longitude, (float, int)
        ):
            self.__float_constructor__(latitude, longitude)
        elif isinstance(latitude, Dms) and isinstance(longitude, Dms):
            self.__Dms_constructor__(latitude, longitude)
        else:
            raise ValueError(
                "latitude and longitude must be both Dms or float type"
            )

    def __float_constructor__(self, latitude: float, longitude: float):
        if (
            longitude < -180.0
            or longitude > 180.0
            or latitude < -90.0
            or latitude > 90.0
        ):
            raise ValueError(
                f"wrong set of latitude, longitude \
which are {latitude}, {longitude}"
            )
        self._longitude = longitude
        self._lg = longitude * pi / 180
        self._latitude = latitude
        self._lt = latitude * pi / 180
        self._dms_latitude = None
        self._dms_longitude = None

    def __Dms_constructor__(self, latitude: Dms, longitude: Dms):
        if latitude._abs() > Dms(180, 0, 0):
            raise ValueError(f"latitude {latitude} is out of range")
        if longitude._abs() > Dms(90, 0, 0):
            raise ValueError(f"longitude {longitude} is out of range")
        self._dms_latitude = latitude
        self._dms_longitude = longitude
        self._latitude = None
        self._longitude = None
        self._lt = None
        self._lg = None

    @property
    def dms_latitude(self):
        if self._dms_latitude is None:
            angle = int(self._latitude)
            minutes = int(abs(self._latitude - angle) * 60)
            hundred_times = 100 * abs(self._latitude)
            seconds = int((hundred_times - int(hundred_times)) * 60)
            self._dms_latitude = Dms(angle, minutes, seconds)
        return self._dms_latitude

    @property
    def dms_longitude(self):
        if self._dms_longitude is None:
            angle = int(self._longitude)
            minutes = int(abs(self._longitude - angle) * 60)
            hundred_times = 100 * abs(self._longitude)
            seconds = int((hundred_times - int(hundred_times)) * 60)
            self._dms_longitude = Dms(angle, minutes, seconds)
        return self._dms_longitude

    @property
    def latitude(self):
        if self._latitude is None:
            self._latitude = (
                abs(self.dms_latitude.angle)
                + self.dms_latitude.minutes / 60
                + self.dms_latitude.seconds / 3600
            )
            if self.dms_latitude.angle < 0:
                self._latitude *= -1
        return self._latitude

    @property
    def longitude(self):
        if self._longitude is None:
            self._longitude = (
                abs(self._dms_longitude.angle)
                + self._dms_longitude.minutes / 60
                + self._dms_longitude.seconds / 3600
            )
            if self.dms_longitude.angle < 0:
                self._longitude *= -1
        return self._longitude

    @property
    def gradient_longitude(self):
        if self._lg is None:
            self._lg = self.longitude * pi / 180
        return self._lg

    @property
    def gradient_latitude(self):
        if self._lt is None:
            self._lt = self.latitude * pi / 180
        return self._lt

    def distance(self, other):
        if not isinstance(other, Gps):
            raise ValueError(
                "Only can calculate distance between 2 gps classes"
            )
        return (
            acos(
                sin(self.gradient_latitude) * sin(other.gradient_latitude)
                + cos(self.gradient_latitude)
                * cos(other.gradient_latitude)
                * cos(other.gradient_longitude - self.gradient_longitude)
            )
            * 6371
        )

    def __str__(self):
        return (
            f"Latitude: {self.dms_latitude}, Longitude: {self.dms_longitude}"
        )


def gps_distance(a: Gps, b: Gps):
    """Returns the distance between two gps position"""
    return a.distance(b)


def get_gps_from_ip(ip: str):
    if ipaddress.ip_address(ip).is_private:
        url = "https://ipinfo.io/json"
    else:
        url = f"https://ipinfo.io/{ip}/json"
    response = requests.get(url, timeout=1)
    response.raise_for_status()
    loc: str = response.json().get("loc")
    if loc is None:
        return None
    coma = loc.find(",")
    return Gps(float(loc[0:coma]), float(loc[coma + 1:]))


def get_town(latitude, longitude):
    url = f"https://nominatim.openstreetmap.org/reverse?lat={latitude}&lon={longitude}&format=json"
    headers = {
        "User-Agent": "Matcha/1.0 (emailaa@aaaa.com)"
    }
    try:
        response = requests.get(url, headers=headers, timeout=1)
        response.raise_for_status()
    except Exception:
        address = None
    address = response.json().get("address")
    return address


if __name__ == "__main__":
    a = Dms(12, 12, 12)
    b = Dms(13, 13, 13)
    c = Dms(14, 14, 14)
    d = Dms(-15, 15, 15)
    e = Gps(a, b)
    f = Gps(c, d)
    print(f.dms_longitude)
    print(f.gradient_longitude)
    print(e.distance(f))
    g = Gps(33.333, 45)
    h = Gps(87.11111, -112.2)
    print(g)
    print(h)
    print(h.gradient_latitude)
    print(h.gradient_longitude)
    print(gps_distance(g, h))
