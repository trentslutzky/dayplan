import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { fs } from "@tauri-apps/api";
import "./global.css";

import * as Scroll from "react-scroll";

import TimeLine from "./components/Timeline";

import HoursBG from "./components/HoursBG";
import TimeBar from "./components/TimeBar";
import Events from "./components/Events";

export default function App() {
  const [events, setEventsState] = useState(null);

  let scroll = Scroll.animateScroll;

  let events_file_path = "./events.json";

  const topbar_height = 100;

  async function setEvents(e, write_file = false) {
    var new_events = [...e];
    setEventsState(new_events);
    // if we aren't supposed to write to the events file,
    // return now
    if (!write_file) {
      return;
    }
    // write the new events object to the file
    await writeJSONToFile(events_file_path,{events:e})
  }

  async function writeJSONToFile(path,data){
    console.log('writing file',path,data)
    try{
      const data_string = JSON.stringify(data);
      await fs.writeFile({
        contents:data_string,
        path:path,
      })
      return true
    }
    catch (error) {
      console.log(error)
      return false
    }
  }

  async function getEventsFromFile() {
    console.log('Getting events.json file...')
    try {
      const events_file = await fs.readTextFile(events_file_path);
      console.log('File found. Getting events.')
      const parsed = JSON.parse(events_file);
      const parsed_events = parsed.events;
      if(Array.isArray(parsed_events) === false){
        // eslint-disable-next-line
        throw 2;
      }
      if(parsed_events == null){
        parsed.events = [];
      }
      setEvents(parsed_events)
    } catch (error) {
      if(error === 2){
        console.log("invalid json file. Can't find events list.");
        setEvents([],true)
        return;
      }
      if(typeof error == 'string'){
        console.log('test')
        if(error.includes("No such file")){
          console.log("file does not exist.");
          setEvents([],true)
        }
        return
      }
      if (error instanceof SyntaxError) {
        console.log("invalid json file.");
        setEvents([],true)
        return
      }
    }
  }

  async function createEvent(time){
    console.log('create event',time);
    var new_events = events.slice();
    new_events.push({
      id:events.length,
      time:time,
      duration:0.25,
      title:'untitled',
    });
    console.log(new_events);
    await setEvents(new_events,true);
  }

  useEffect(() => {
    if (events == null) {
      getEventsFromFile();
    }
  });

  function timelineEventClicked(time) {
    scroll.scrollTo(time * 200 - 200, {
      duration: 1000,
      smooth: "easeOutQuint",
    });
  }

  return (
    <MainContainer>
      <ListBox topbar_height={topbar_height}>
        <TimeLine events={events || []} click={timelineEventClicked} />
      </ListBox>
      <CalendarView topbar_height={topbar_height}>
        <HoursBG 
          createEvent={createEvent}
        />
        <TimeBar />
        <Events
          events={events || []}
          setEvents={setEvents}
          topbar_height={topbar_height}
        />
      </CalendarView>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  font-family: Jetbrains Mono Nerd Font;
  height: 4900px;
  min-width: 300px;
`;

const ListBox = styled.div`
  z-index: 10;
  position: fixed;
  width: 100%;
  background: #111111;
  height: ${(props) => props.topbar_height}px;
  -webkit-box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.65);
  box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.65);
`;

const CalendarView = styled.div`
  padding-top: ${props => props.topbar_height}px;
`;
