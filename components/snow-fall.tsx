"use client";
import React from "react";
import Snowfall from "react-snowfall";
import AutoPlayMusic from "./AutoPlayMusic";

const SnowFall = () => {
  return (
    <div className="absolute top-0 left-0 z-9999">
      <Snowfall
        color="white"
        radius={[2, 3]}
        snowflakeCount={500}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
        }}
      />
      <AutoPlayMusic src="/bg_sound_christmas.mp3" />
    </div>
  );
};

export default SnowFall;
