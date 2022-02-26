import React, { useEffect, useRef } from "react";
import styled from "styled-components";

export default function TimeBar() {
  const day_ms = 24 * 60 * 60 * 1000;
  const hour_height_px = 200;
  const hour_vertical_offset = 175;

  const bar_ref = useRef(null);

  function setTimeBar() {
    let current_date = new Date();
    let current_time = current_date.getTime();
    let today_start = new Date(new Date().setHours(0, 0, 0)).getTime();
    document.getElementById("elapsed").style.top =
      (
        ((current_time - today_start) / day_ms) * (hour_height_px * 24) +
        hour_vertical_offset
      ) //this is super jank
        .toString() + "px";
    document.getElementById("current-time").innerHTML =
      current_date.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "numeric",
        minute: "numeric",
      });
  }

  useEffect(() => {
    setTimeBar();
    const Timer = setInterval(() => {
      setTimeBar();
    }, 60000);
    return () => clearInterval(Timer);
  });

  return (
    <ElapsedDiv id="elapsed" ref={bar_ref}>
      <CurrentTimeIndicator id="current-time"></CurrentTimeIndicator>
    </ElapsedDiv>
  );
}

const ElapsedDiv = styled.div`
  position: absolute;
  width: 100%;
  background-color: #9c2c2c;
  height: 4px;
  margin-top: -4px;
  z-index: 6;
`;

const CurrentTimeIndicator = styled.div`
  position: absolute;
  transform: translate(-8px, -40%);
  background: #9c2c2c;
  font-size: 16px;
  font-weight: bold;
  border-radius: 50px;
  padding: 3px;
  padding-left: 27px;
  padding-right: 11px;
  left: -10px;
`;
