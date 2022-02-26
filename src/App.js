import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { fs } from "@tauri-apps/api";
import "./global.css";

import * as Scroll from "react-scroll";

import TimeLine from "./components/Timeline";

import CalendarView from "./CalendarView";

export default function App() {
  const [events, setEventsState] = useState(null);

  let scroll = Scroll.animateScroll;

  let events_file_path = "./events.json";

  const topbar_height = 150;

  async function setEvents(e, write_file = false) {
    setEventsState(e);
    // if we aren't supposed to write to the events file,
    // return now
    if (!write_file) {
      return;
    }
    // write the new events object to the file
    const file_written = await writeJSONToFile(events_file_path,{events:e})
    console.log(file_written);
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
        throw 2;
      }
      if(parsed_events == null){
        parsed.events = [];
      }
      setEvents(parsed_events)
    } catch (error) {
      console.log(error)
      if(error === 2){
        console.log("invalid json file. Can't find events list.");
        await writeJSONToFile(events_file_path,{events:[]});
        return;
      }
      if(typeof error == String){
        if(error.includes("No such file")){
          console.log("file does not exist.");
          await writeJSONToFile(events_file_path,{events:[]})
        }
        return
      }
      if (error instanceof SyntaxError) {
        console.log("invalid json file.");
        await writeJSONToFile(events_file_path,{events:[]})
        return
      }
    }
  }

  async function saveEvents() {
    const events_text = JSON.stringify(events);
  }

  useEffect(() => {
    if (events == null) {
      getEventsFromFile();
    }
  }, [events]);

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
      <CalendarView
        events={events}
        setEvents={setEvents}
        topbar_height={topbar_height}
      />
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
