import { render, screen, fireEvent } from "@testing-library/react";
import ReactDOM from "react-dom";
import React from "react";
import App from "./App";
import * as axios from "axios";

//test sentiment analysis trigger
//  test("test sentiment analysis trigger", () => {

//  });

test("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
});

// test if response message var is initalized when twilio bot replies

 test("good response", () => {
    axios.get.mockImplementation(() => Promise.resolve({ status: 200 }));
  
  });


 test("bad response", () => {
    axios.get.mockImplementation(() => Promise.resolve({ status: 400 }));
  
  });
