import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "../../vendor/libs/react-datepicker/react-datepicker.scss";

const CustomDatePicker = props => {
  const isIE10Mode = document["documentMode"] === 10;
  const { startDate, handleDateChange } = props;

  function placement() {
    const isRTL = document.documentElement.getAttribute("dir") === "rtl";
    return isRTL ? "auto-end" : "auto-start";
  }

  return (
    <React.Fragment>
      {isIE10Mode && (
        <div className="alert alert-danger">
          <strong>react-datepicker</strong> doesn't support Internet Explorer 10
        </div>
      )}
      {!isIE10Mode && (
        <React.Fragment>
          <DatePicker
            className="form-control"
            dateFormat="MM/dd/yyyy"
            placeholderText="mm/dd/yyyy"
            todayButton={"Today"}
            isClearable={true}
            selected={startDate}
            onChange={handleDateChange}
            popperPlacement={placement()}
            filterDate={date => {
              return moment() > date;
            }}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default CustomDatePicker;
