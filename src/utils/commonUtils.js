import humidity from "../assets/humidity.svg";
import wind from "../assets/wind.svg";
import uv from "../assets/uv.svg";
import pressure from "../assets/pressure.svg";

export const getIconByKey = (key) => {
  switch (key) {
    case "humidity": {
      return humidity;
    }
    case "windchill_f":
    case "windchill_c": {
      return wind;
    }
    case "uv": {
      return uv;
    }
    case "pressure_mb": {
      return pressure;
    }
    default: {
      return humidity;
    }
  }
};
