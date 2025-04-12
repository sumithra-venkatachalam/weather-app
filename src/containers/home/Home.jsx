import "./Home.css";
import axios from "axios";
import { useState, useEffect } from "react";
import additionalDetailsMockData from "../../utils/additionalDetails.json";
import WeatherCard from "../../components/weather_card/WeatherCard";
import buildingBg from "../../assets/building-bg.png";
import settingsIcon from "../../assets/settings.svg";
import searchIcon from "../../assets/search.svg";
import locationIcon from "../../assets/location.svg";
import feelsLike from "../../assets/feels-like.svg";
import backIcon from "../../assets/back-icon.svg";
import historyIcon from "../../assets/history-icon.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import moment from "moment";

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherDetails, setWeatherDetails] = useState({
    location: {},
    current: {},
  });
  const [additionalDetails, setAdditionalDetails] = useState([]);
  const [userSettingsOpen, setUserSettingsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isTempC, setIsTempC] = useState(true);
  const [showList, setShowList] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const getLastFiveElements = (arr) => {
    if (!Array.isArray(arr)) {
      throw new Error("Input must be an array");
    }
    return arr.slice(-5);
  }

  const getTemperatureDetails = (searchValue) => {
    setIsLoading(true);
    axios
      .get(
        `https://api.weatherapi.com/v1/current.json?key=bdb504e98ef54d49a1760256242412&q=${
          searchValue || "Chennai"
        }`
      )
      .then((res) => {
        const current = res?.data?.current;
        const additionalDetailsArray = additionalDetailsMockData.map(
          (eachDetail) => {
            return {
              ...eachDetail,
              value: !isTempC
                ? current?.[eachDetail?.key_f] || current?.[eachDetail?.key]
                : current?.[eachDetail?.key],
            };
          }
        );
        setAdditionalDetails(additionalDetailsArray);
        setWeatherDetails(res.data);
        setIsLoading(false);
        setSearchText("");
        if (searchValue?.length) {
          const currentHistory = [...searchHistory];
          const isExist = currentHistory?.findIndex(
            (eachHistory) =>
              searchValue?.toLowerCase() === eachHistory?.toLowerCase()
          );
          if (isExist === -1) {
            currentHistory.push(searchValue);
            const updatedArr = getLastFiveElements(currentHistory);
            setSearchHistory(updatedArr);
            localStorage.setItem(
              "searchHistory",
              JSON.stringify(currentHistory)
            );
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setSearchText("");
      });
  };

  useEffect(() => {
    const lsSearchList = localStorage.getItem("searchHistory");
    try {
      const parsedList = JSON.parse(lsSearchList);
      setSearchHistory(parsedList || []);
    } catch (e) {
      console.log(e);
      setSearchHistory([]);
    }
    getTemperatureDetails();
  }, []);

  const { location, current } = weatherDetails || {};

  const handleSearchClick = () => {
    getTemperatureDetails(searchText);
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      getTemperatureDetails(searchText);
    }
  };

  const handleDeleteSearch = (index) => {
    const currentHistory = [...searchHistory];
    currentHistory.splice(index, 1);
    setSearchHistory(currentHistory);
    localStorage.setItem("searchHistory", JSON.stringify(currentHistory));
  };

  const filteredSearchList = searchHistory?.filter((eachSearch) =>
    eachSearch?.toLowerCase()?.includes(searchText?.toLowerCase())
  );

  let innerContainer = null;

  if (userSettingsOpen) {
    innerContainer = (
      <div className="SettingsContentContainer">
        <img
          onClick={() => setUserSettingsOpen(false)}
          src={backIcon}
          alt="back-icon"
          className="BackIcon"
        />
        <div className="SettingsContainer">
          <h1 className="TemperatureUnitTitle">Temperature unit</h1>
          <div className="ButtonContainer">
            <span
              className={isTempC && "ActiveButton"}
              onClick={() => setIsTempC(true)}
            >
              Celsius
            </span>
            <span
              className={!isTempC && "ActiveButton"}
              onClick={() => setIsTempC(false)}
            >
              Fahrenheit
            </span>
          </div>
          <div className="HistoryContainer">
            <h2>History</h2>
            <div className="HistoryList">
              {searchHistory?.map((eachHistory, index) => {
                return (
                  <div className="EachHistory">
                    <div className="HistoryLeftContainer">
                      <img src={historyIcon} alt="history-icon" />
                      <span>{eachHistory}</span>
                    </div>
                    <img
                      src={deleteIcon}
                      alt="delete-icon"
                      className="DeleteIcon"
                      onClick={() => handleDeleteSearch(index)}
                    />
                  </div>
                );
              })}
              {searchHistory?.length === 0 && <span>No data found!</span>}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    const originalTime = location?.localtime;
    const formattedTime = moment(originalTime).format("hh:mm A");
    const formattedDate = moment(originalTime).format("dddd, MMMM DD");
    innerContainer = (
      <div className="ContentContainer">
        <div className="header">
          <div>
            <h1 className="GoodMorningText">Good Morning, Sheldon Cooper</h1>
            <p className="InformationText">
              Check out today's weather information
            </p>
          </div>
          <img
            src={settingsIcon}
            alt="settings-icon"
            onClick={() => setUserSettingsOpen(true)}
            className="SettingsIcon"
          />
        </div>
        <div className="DropdownContainer">
          <div className="SearchBarContainer">
            <input
              onChange={(e) => setSearchText(e.target.value)}
              className="SearchBar"
              type="text"
              placeholder="Search ..."
              onFocus={() => searchHistory?.length && setShowList(true)}
              onBlur={() => setTimeout(() => setShowList(false), 300)}
              onKeyDown={handleSearchEnter}
            />
            <img
              src={searchIcon}
              alt="search-icon"
              onClick={handleSearchClick}
              className="SearchIcon"
            />
          </div>
          {showList && (
            <ul className="SearchList" onClick={(e) => e?.stopPropagation()}>
              {filteredSearchList.map((city, index) => (
                <li
                  className="SearchItem"
                  key={index}
                  onClick={(e) => {
                    e?.stopPropagation();
                    getTemperatureDetails(city);
                  }}
                >
                  <img src={historyIcon} alt="history-icon" />
                  {city}
                </li>
              ))}
              {!filteredSearchList?.length && searchHistory?.length && (
                <li className="SearchItem">No results found</li>
              )}
            </ul>
          )}
        </div>
        {isLoading ? (
          <div className="OuterContainer">
            <span>Loading please wait...</span>
          </div>
        ) : (
          <div className="OuterContainer">
            <div className="WeatherDetails">
              <div className="LeftContainer">
                <div className="LocationContainer">
                  <img src={locationIcon} alt="location-icon" />
                  <h3>{location?.name}</h3>
                </div>
                <span className="RegionText">
                  {location?.region}, {location?.country}
                </span>
                <h1 className="TempText">
                  {isTempC
                    ? `${current?.temp_c} ° C`
                    : `${current?.temp_f} ° F`}
                </h1>
                <div className="FeelsLikeContainer">
                  <img src={feelsLike} alt="feels-like-icon" />
                  <span className="FeelsLikeText">
                    Feels like{" "}
                    <b>
                      {isTempC
                        ? `${current?.feelslike_c} ° C`
                        : `${current?.feelslike_f} ° F`}
                    </b>
                  </span>
                </div>
                <span className="WeatherForecastTitle">Weather forecast</span>
                <h2 className="WeatherForecastValue">
                  {current?.condition?.text}
                </h2>
              </div>
              <div className="RightContainer">
                <h2 className="CurrentTime">{formattedTime}</h2>
                <span className="CurrentDate">{formattedDate}</span>
              </div>
            </div>
            <div className="AdditionalDetails">
              <span className="AdditionalDetailsTitle">
                More details on today's weather
              </span>
              <div className="CardContainer">
                {additionalDetails.map((eachDetail) => {
                  return (
                    <WeatherCard
                      key={eachDetail?.key}
                      title={eachDetail?.title}
                      value={eachDetail?.value}
                      uniquekey={eachDetail?.key}
                      suffix={
                        !isTempC
                          ? eachDetail?.suffix_f || eachDetail?.suffix
                          : eachDetail?.suffix
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="MainContainer">
      <img src={buildingBg} alt="building-bg" className="BuildingBg" />
      {innerContainer}
    </div>
  );
}
export default Home;
