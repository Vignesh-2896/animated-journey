import React from "react";
import "./index.css";
import App from "./App";
import { createRoot } from "react-dom/client";

let domNode = document.getElementById("root");
let rootElement = createRoot(domNode);
rootElement.render(<App />);
