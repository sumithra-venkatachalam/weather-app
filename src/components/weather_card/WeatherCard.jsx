import { getIconByKey } from "../../utils/commonUtils";
import "./WeatherCard.css";

function WeatherCard({ title, value, uniquekey, suffix }) {
  console.log(uniquekey);
  return (
    <div className="EachCard">
      <img src={getIconByKey(uniquekey)} alt="additional-details-icon" />
      <div className="EachCardDetails">
        <h1>{title}</h1>
        <h3>
          {value}
          {suffix}
        </h3>
      </div>
    </div>
  );
}
export default WeatherCard;
