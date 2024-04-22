from tools import GPS_tools
from error_status.error import BadRequestError


class NotValidGpsException(BadRequestError):
    def __init__(self, latitude, longitude, err):
        self.message = f"{latitude=}, {longitude=} is not valid \
gps because {err}"


class TypeException(BadRequestError):
    def __init__(self, foo, argName):
        self.message = f"{argName} must be a float or an int. \
Type received is {type(foo).__name__}"


class NotLatitudeException(BadRequestError):
    def __init__(self, value):
        self.message = f"wrong latitude {value}. It must be in \
range [-90.0, 90]"


class NotLongitudeException(BadRequestError):
    def __init__(self, value):
        self.message = f"wrong longitude {value}. It must be in \
range [-90.0, 90]"


def isGps(latitude: any, longitude: any, req: dict[str, any] = {}):
    """Check if longitude and latitude are float class, then check
    if they are in correct Gps range, raising a NotValidGpsException if not.
    req list are follows:
    ["optionnal"] : if longitude and latitude are None: does not throw and
    None is returned.
    tuple of (latitude, longitude) is returned by default.
    """
    if req.get("optionnal") is not None:
        if (longitude is None) and (latitude is None):
            return None
    try:
        GPS_tools.Gps(latitude, longitude)
    except ValueError as e:
        raise NotValidGpsException(latitude, longitude, str(e))
    return (latitude, longitude)


def isLatitude(foo: any, req: dict[str, any] = {}):
    """Check if foo is a float or an int and in range of [-90, 90],
    raising a NotValidLatitude if not.
    Upon success, foo is returned.
    req options list are followed:
    ["optionnal"] : if foo is None, does not raise.
    """
    if req.get("optionnal") is not None:
        if foo is None:
            return None
    if not isinstance(foo, (float, int)):
        raise TypeException(foo, "latitude")
    if foo < -90.0 or foo > 90.0:
        raise NotLatitudeException(foo)
    return foo


def isLongitude(foo: any, req: dict[str, any] = {}):
    """Check if foo is a float or an int and in range of [-180, 180],
    raising a NotValidLongitude if not.
    Upon success, foo is returned.
    req options list are followed:
    ["optionnal"] : if foo is None, does not raise.
    """
    if req.get("optionnal") is not None:
        if foo is None:
            return None
    if not isinstance(foo, (float, int)):
        raise TypeException(foo, "longitude")
    if foo < -90.0 or foo > 90.0:
        raise NotLongitudeException(foo)
    return foo
