import React from "react";
import styled from "styled-components";

export default function HoursBG({createEvent}) {
  const hours = [];

  for (let h = 0; h < 24; h++) {
    let hour_string = String(h);
    hours.push(
      <Hour
        key={h} 
        h={hour_string} 
        createEvent={createEvent}
      />
    );
  }

  return <BG>{hours}</BG>;
}

function Hour({ h,createEvent }) {
  h = parseInt(h)
  const h_24 = parseInt(h)
  var p = "AM";
  if (h === 24) {
    return (
      <EndLine>
        <HourText>12:00 am</HourText>
        <Line />
      </EndLine>
    );
  }
  if (h > 12) {
    h = h - 12;
    p = "PM";
  }
  return (
    <HourContainer>
      <MouseOvers>
        <MouseOverContainer>
          <MouseOver onClick={()=>{createEvent(h_24)}}/>
        </MouseOverContainer>
        <MouseOverContainer>
          <MouseOver onClick={()=>{createEvent(h_24+0.25)}}/>
        </MouseOverContainer>
        <MouseOverContainer>
          <MouseOver onClick={()=>{createEvent(h_24+0.5)}}/>
        </MouseOverContainer>
        <MouseOverContainer>
          <MouseOver onClick={()=>{createEvent(h_24+0.75)}}/>
        </MouseOverContainer>
      </MouseOvers>
      <TimeLine>
        <HourText>
          {h}:00 {p}
        </HourText>
        <Line />
      </TimeLine>
      <TimeLine>
        <HalfHourText>
          {h}:15 {p}
        </HalfHourText>
        <HalfLine />
      </TimeLine>
      <TimeLine>
        <HalfHourText>
          {h}:30 {p}
        </HalfHourText>
        <HalfLine />
      </TimeLine>
      <TimeLine>
        <HalfHourText>
          {h}:45 {p}
        </HalfHourText>
        <HalfLine />
      </TimeLine>
    </HourContainer>
  );
}

const MouseOver = styled.div`
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 0px;
  right: 0px;
  border-radius: 5px;
  transition: all 0.2s;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const MouseOverContainer = styled.div`
  width: 100%;
  height: 25%;
  z-index: 2;
  position: relative;
`;

const MouseOvers = styled.div`
  position: absolute;
  top: 25px;
  bottom: -25px;
  left: 100px;
  right: 19px;
  z-index: 2;
`;

const HourContainer = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  -webkit-user-select: none;
  position: relative;
`;

const TimeLine = styled.div`
  margin: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  width: 100%;
  flex-grow: 1;
  z-index: 1;
`;

const HourText = styled.p`
  padding: 0;
  margin: 0;
  margin-left: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  height: 20px;
  width: 70px;
  font-weight: bold;
  text-align: center;
`;

const HalfHourText = styled(HourText)`
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
`;

const Line = styled.hr`
  flex-grow: 1;
  margin-left: 20px;
  margin-right: 20px;
  border-width: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.1);
`;

const HalfLine = styled(Line)`
  border-top: 2px solid rgba(255, 255, 255, 0.05);
  height: 0.5px;
  background: transparent;
`;

const EndLine = styled(TimeLine)`
  margin-top: 20px;
`;

const BG = styled.div`
  background: #161616;
`;
