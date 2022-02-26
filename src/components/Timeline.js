import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const palette = [
  "#F94144",
  "#F3722C",
  "#F8961E",
  "#F9844A",
  "#F9C74F",
  "#90BE6D",
  "#43AA8B",
  "#4D908E",
  "#577590",
  "#277DA1",
];

const day_ms = 24 * 60 * 60 * 1000;

export default function TimeLine({ events, click }) {
  const timeline_ref = useRef(null);

  const [timelineWidth, setTimelineWidth] = useState(0);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);

  useEffect(() => {
    setTimelineWidth(timeline_ref.current.offsetWidth);
  }, [currentTimeMs]);

  function setTimeBar() {
    let current_date = new Date();
    let current_time = current_date.getTime();
    let today_start = new Date(new Date().setHours(0, 0, 0)).getTime();
    let time_diff = current_time - today_start;
    let timeline_width = timeline_ref.current.offsetWidth;
    setCurrentTimeMs(time_diff);
    document.getElementById("time_line").style.left =
      ((time_diff / day_ms) * timeline_width).toString() + "px";
    document.getElementById("time_tick").style.left =
      ((time_diff / day_ms) * timeline_width - 3.6).toString() + "px";
  }

  useEffect(() => {
    setTimeBar();
    const Timer = setInterval(() => {
      setTimeBar();
    }, 1000);
    return () => clearInterval(Timer);
  }, []);

  return (
    <TimeLineBox ref={timeline_ref}>
      {events.map((e, i) => (
        <EventBlock
          key={i}
          color={palette[i]}
          duration={e.duration * (timelineWidth / 24)}
          time={e.time * (timelineWidth / 24)}
          onClick={() => {
            click(e.time);
          }}
        />
      ))}
      <CurrentTimeBlock id="time_line" />
      <CurrentTimeTriangle id="time_tick" />
    </TimeLineBox>
  );
}

const CurrentTimeBlock = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  height: 25px;
  width: 2px;
  background: red;
  z-index: 4;
`;

const CurrentTimeTriangle = styled.div`
  visibility: hidden;
  position: absolute;
  top: 19px;
  left: 0px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 5px 6px 5px;
  border-color: transparent transparent #ff0000 transparent;
  z-index: 4;
`;

const TimeLineBox = styled.div`
  width: 100%;
  height: 25px;
  background: #0b0b0b;
  display: inline-flex;
  min-width: 300px;
`;

const EventBlock = styled.div`
  width: ${(props) => props.duration}px;
  height: 15px;
  top: 5px;
  border-left: 1px solid #0b0b0b;
  background: ${(props) => props.color};
  opacity: 0.6;
  z-index: 4;
  &:hover {
    border: none;
    opacity: 1;
    z-index: 5;
  }
  position: absolute;
  left: ${(props) => props.time}px;
  transition: all 0.05s;
`;
