import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";

import useMousePosition from "../util/useMousePosition";

const hour_height = 200;

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

export default function Events({ events, setEvents, topbar_height }) {
  return (
    <EventsContainer>
      {events.map((e, i) => (
        <Event
          topbar_height={topbar_height}
          events={events}
          key={i}
          event_id={e.id}
          time={e.time}
          duration={e.duration}
          title={e.title}
          color={palette[i]}
          setEvents={setEvents}
        />
      ))}
    </EventsContainer>
  );
}

function Event({
  events,
  time,
  event_id,
  duration,
  title,
  color,
  setEvents,
  topbar_height,
}) {
  const [newDuration, setNewDuration] = useState(duration);

  const { y } = useMousePosition();
  const font_size = 20;

  const boxRef = useRef(null);

  const [resizing, setResizing] = useState(false);
  const [moving, setMoving] = useState(false);
  const [hold, setHold] = useState(true);

  const [prev_mouse, setPrevMouse] = useState(0);

  const [prev_height, setPrevHeight] = useState(duration * hour_height - 8);
  const [newHeight, setNewHeight] = useState(duration * hour_height - 8);

  const [prev_pos, setPrevPos] = useState(time * hour_height);
  const [newPos, setNewPos] = useState(time * hour_height);

  useEffect(() => {
    boxRef.current.style.height = `${duration * hour_height - 8}px`;
    boxRef.current.style.top = `${time * hour_height + topbar_height}px`;
  }, [duration, time, topbar_height]);

  useEffect(() => {
    if (moving) {
      document.body.style.cursor = "move";
    } else if (resizing) {
      document.body.style.cursor = "row-resize";
    }
    if (!moving && !resizing) {
      document.body.style.cursor = "default";
    }
  }, [moving, resizing]);

  useEffect(() => {
    if (resizing === true || moving === true) {
      boxRef.current.style.zIndex = "9";
    } else {
      boxRef.current.style.zIndex = "3";
    }
  });

  useEffect(() => {
    if (resizing) {
      const dif = y - prev_mouse;
      var new_height = prev_height + dif;
      if (new_height < 42) {
        new_height = 42;
        return;
      }
      setNewHeight(new_height);
      const newHeight_rounded =
        50 === 0 ? newHeight : Math.floor(newHeight / 50 + 0.5) * 50;
      setNewDuration(newHeight_rounded / 200);
      boxRef.current.style.height = (new_height - 8).toString() + "px";
    }
  }, [resizing, newHeight, prev_height, prev_mouse, y]);

  useEffect(() => {
    if (moving) {
      const dif = y - prev_mouse;
      const new_pos = prev_pos + dif;
      setNewPos(new_pos);
      boxRef.current.style.top = `${new_pos + topbar_height}px`;
    }
  }, [moving, prev_mouse, prev_pos, y, topbar_height]);

  useEffect(() => {
    window.addEventListener(
      "mouseup",
      function () {
        setResizing(false);
        setMoving(false);
      },
      { once: true },
      true
    );
  }, [resizing, moving]);

  useEffect(() => {
    if (resizing === false && moving === false) {
      if (resizing === true || moving === true || hold === true) {
        return;
      }
      const newHeight_rounded =
        50 === 0 ? newHeight : Math.floor(newHeight / 50 + 0.5) * 50;
      const newPos_rounded =
        50 === 0 ? newPos : Math.floor(newPos / 50 + 0.5) * 50;
      const new_duration = newHeight_rounded / 200;

      setNewDuration(newDuration);
      setPrevPos(newPos_rounded);
      setPrevHeight(newHeight_rounded);

      boxRef.current.style.top =
        (newPos_rounded + topbar_height).toString() + "px";
      boxRef.current.style.height = (newHeight_rounded - 8).toString() + "px";

      //set the event properties in the data
      const new_time = newPos_rounded / 200;

      var updated = false;
      for (let i = 0; i < events.length; i++) {
        if (events[i].id === event_id) {
          let event = events[i];
          if (new_time !== event.time) {
            event.time = new_time;
            updated = true;
          }
          if (new_duration !== event.duration) {
            event.duration = new_duration;
            updated = true;
          }
          if (updated) {
            console.log("event updated", event);
          }
        }
      }
      if (updated) {
        setEvents(events, true);
      }
    }
  }, [
    resizing,
    moving,
    event_id,
    events,
    hold,
    newDuration,
    newHeight,
    newPos,
    setEvents,
    topbar_height,
  ]);

  async function startResize(pos) {
    setHold(false);
    await setPrevMouse(pos);
    setResizing(true);
  }

  async function startMove(pos) {
    setHold(false);
    await setPrevMouse(pos);
    setMoving(true);
  }

  return (
    <EventBox
      ref={boxRef}
      color_bg={color + "60"}
      moving={moving}
      resizing={resizing}
    >
      <BoxContents>
        <EventText onClick={()=>{console.log(title)}}>
          <TimeText color={color} font_size={font_size}>
            {newDuration < 1 ? `${newDuration * 60}m` : `${newDuration}h`}
          </TimeText>
          <EventTitle color={color} font_size={font_size}>
            {title}
          </EventTitle>
        </EventText>
        <DragTop
          onMouseDown={() => {
            startMove(y);
          }}
        />
        <DragBottom
          onMouseDown={() => {
            startResize(y);
          }}
        />
      </BoxContents>
    </EventBox>
  );
}

const DragBottom = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0px;
  height: 10px;
  cursor: row-resize;
`;

const DragTop = styled.div`
  position: absolute;
  width: 100%;
  top: 0px;
  bottom: 10px;
`;

const TimeText = styled.span`
  color: white;
  font-weight: normal;
  font-size: ${(props) => props.font_size}px;
  margin:10px;
`;

const EventTitle = styled.span`
  font-weight: bold;
  color: ${(props) => props.color};
  font-size: ${(props) => props.font_size}px;
  margin:5px;
`;

const EventText = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BoxContents = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EventBox = styled.div`
  min-width: 300px;
  z-index: 3;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  opacity: 0.8;
  position: absolute;
  transition: all 0.01s;
  background: ${(props) => props.color_bg};
  border-radius: 5px;
  right: 20px;
  left: 100px;
  margin-top: 30px;
  &:hover {
    opacity: 1;
  }
  ${(props) => props.moving && "opacity: 1;"}
  ${(props) => props.resizing && "opacity: 1;"}
`;

const EventsContainer = styled.div`
  position: absolute;
  height: 5000px;
  background: #161616;
  top: 0;
  width: 100%;
`;
