import React from "react";
import styled from "styled-components";

import HoursBG from "./components/HoursBG";
import Events from "./components/Events";
import TimeBar from "./components/TimeBar";

export default function CalendarView({ events, topbar_height, setEvents }) {
  return (
    <CalendarViewContainer topbar_height={topbar_height}>
      <HoursBG />
      <TimeBar />
      <Events
        events={events || []}
        setEvents={setEvents}
        topbar_height={topbar_height}
      />
    </CalendarViewContainer>
  );
}

const CalendarViewContainer = styled.div`
  padding-top: ${(props) => props.topbar_height}px;
`;
