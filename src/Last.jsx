import React, { useState, useEffect } from "react";
import "./Last.css";
import axios from "axios";

const Last = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timezone, setTimezone] = useState("UTC-0");
  const [selectedTimes, setSelectedTimes] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  });

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };
  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}`;
  };

  const [uniqueId, setUniqueId] = useState(100);
  const [dataArray, setDataArray] = useState([]);

  const handleCheckboxChange = (day, timeValue, formattedDate) => {
    const newSelectedTimes = { ...selectedTimes };
    if (!newSelectedTimes[day]) {
      newSelectedTimes[day] = [];
    }
    const index = newSelectedTimes[day].indexOf(timeValue);
    if (index === -1) {
      newSelectedTimes[day].push(timeValue);
    } else {
      newSelectedTimes[day].splice(index, 1);
    }
    setSelectedTimes(newSelectedTimes);
    const currentDate = new Date();
    const newName = `test${uniqueId - 100}`;
    const newData = {
      ID: uniqueId,
      Name: newName,
      Time: timeValue,
      Date: formattedDate,
    };
    setUniqueId(uniqueId + 1);
    const newDataArray = [...dataArray, newData];
    setDataArray(newDataArray);
    updateServerData(newDataArray);
  };
  const formattedDate2 = selectedDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const updateServerData = (newData) => {
    axios
      .post("http://localhost:3002/updateWorkingDays", newData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (!response.data) {
          throw new Error("Network response was not ok");
        }
        console.log("Data updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating server data:", error);
      });
  };
  const [mainData, setMainData] = useState([]);
  const clearDataOnReload = () => {
    axios
      .delete("http://localhost:3002/clearDataOnReload")
      .then((response) => {
        if (response.data.success) {
          console.log("Data cleared on server successfully.");
        } else {
          console.error("Error clearing data on the server.");
        }
      })
      .catch((error) => {
        console.error("Error clearing data:", error);
      });
  };

  useEffect(() => {
    window.addEventListener("beforeunload", clearDataOnReload);

    return () => {
      window.removeEventListener("beforeunload", clearDataOnReload);
    };
  }, []);

  const [utc0, setUtc0] = useState(true);
  const [utc1, setUtc1] = useState(false);

  const firstSift = [
    "8:00AM", "8:30AM", "9:00AM", "9:30AM", "10:00AM", "10:30AM", "11:00AM", "11:30AM"
  ];
  
  const secondSift = [
    "12:00PM", "12:30PM", "1:00PM", "1:30PM", "2:00PM", "2:30PM", "3:00PM", "3:30PM", "4:00PM", "4:30PM", "5:00PM"
  ];
  
  const thirdSift = [
    "7:00PM", "7:30PM", "8:00PM", "8:30PM", "9:00PM", "9:30PM", "10:00PM", "10:30PM", "11:00PM"
  ];
  
  const usFirstSift = [
    "11:00AM", "11:30AM", "12:00PM", "12:30PM", "1:00PM", "1:30PM", "2:00PM", "2:30PM"
  ];
  
  const usSecondSift = [
    "3:00PM", "3:30PM", "4:00PM", "4:30PM", "5:00PM", "5:30PM", "6:00PM", "6:30PM", "7:00PM", "7:30PM"
  ];
  
  const usThirdSift = [
    "10:00PM", "10:30PM", "11:00PM", "11:30PM", "12:00AM", "12:30AM", "1:00AM", "1:30AM", "2:00AM"
  ];
  

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thus", "Fri"];

  const calculateStartOfWeek = () => {
    const currentDate = new Date(selectedDate);
    const currentDayOfWeek = currentDate.getDay();
    const daysToAdd = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    return currentDate;
  };

  const startOfWeek = calculateStartOfWeek();
  const handleTimezoneChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "UTC-0") {
      setUtc0(true);
      setUtc1(false);
    } else if (selectedValue === "UTC+1") {
      setUtc0(false);
      setUtc1(true);
    }
    setTimezone(selectedValue);
  };

  return (
    <div className="harsh">
      <div className="pranav">
        <div className="btn-1">
          <button style={{ cursor: "pointer" }} onClick={handlePrevWeek}>
            ⬅Previous Week
          </button>
        </div>
        <p > {formattedDate2}</p>
        <div className="btn-2">
          <button style={{ cursor: "pointer" }} onClick={handleNextWeek}>
            Next Week➡
          </button>
        </div>
      </div>

      <div className="time">
        <label htmlFor="timezone"> Timezone: </label>
        <select id="timezone" value={timezone} onChange={handleTimezoneChange}>
          <option value="UTC-0">UTC-0</option>
          <option value="UTC+1">UTC+1</option>
        </select>
    <div className="days">
      <form method="POST">
        <ul>
          {daysOfWeek.map((day, index) => {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(currentDate.getDate() + index);
            const formattedDate = formatDate(currentDate);
            const isWorkingDay =
              (index >= 0 && index <= 4 && currentDate >= new Date()) ||
              formatDate(new Date()) == formattedDate;
            return (
              <li key={day}>
                <div className="aman">
                  <div
                    style={{ background: "#80808063", padding: "1.2rem" }}
                  >
                    <h3 style={{ color: "red", fontSize: "1.2rem" }}>{day}</h3>
                    <p>{formattedDate}</p>
                  </div>
                  {isWorkingDay ? (
                    <div
                      className="op"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        <div style={{ display: "flex" }}>
                          {utc0
                            ? firstSift.map((timeValue) => (
                                <div key={timeValue}>
                                  <input
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxChange(
                                        formattedDate,
                                        timeValue,
                                        formattedDate
                                      )
                                    }
                                    value={timeValue}
                                  />
                                  {timeValue}&nbsp;
                                </div>
                              ))
                            : usFirstSift.map((timeValue) => (
                                <div key={timeValue}>
                                  <input
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxChange(
                                        formattedDate,
                                        timeValue,
                                        formattedDate
                                      )
                                    }
                                    value={timeValue}
                                  />
                                  {timeValue}&nbsp;
                                </div>
                              ))}
                        </div>
                      </div>
                      <div style={{ display: "flex" }}>
                        {utc0
                          ? secondSift.map((timeValue) => (
                              <div key={timeValue}>
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    handleCheckboxChange(
                                      formattedDate,
                                      timeValue,
                                      formattedDate
                                    )
                                  }
                                  value={timeValue}
                                />
                                {timeValue}&nbsp;
                              </div>
                            ))
                          : usSecondSift.map((timeValue) => (
                              <div key={timeValue}>
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    handleCheckboxChange(
                                      formattedDate,
                                      timeValue,
                                      formattedDate
                                    )
                                  }
                                  value={timeValue}
                                />
                                {timeValue}&nbsp;
                              </div>
                            ))}
                      </div>
                      <div style={{ display: "flex" }}>
                        {utc0
                          ? thirdSift.map((timeValue) => (
                              <div key={timeValue}>
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    handleCheckboxChange(
                                      formattedDate,
                                      timeValue,
                                      formattedDate
                                    )
                                  }
                                  value={timeValue}
                                />
                                {timeValue}&nbsp;
                              </div>
                            ))
                          : usThirdSift.map((timeValue) => (
                              <div key={timeValue}>
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    handleCheckboxChange(
                                      formattedDate,
                                      timeValue,
                                      formattedDate
                                    )
                                  }
                                  value={timeValue}
                                />
                                {timeValue}&nbsp;
                              </div>
                            ))}
                      </div>
                    </div>
                  ) : (
                    <div className="past">Past</div>
                  )}
                </div>
                <br />
                <hr />
              </li>
            );
          })}
        </ul>
      </form>
    </div>


      </div>
    </div>
  );
};

export default Last;
