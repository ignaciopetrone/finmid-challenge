import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.scss";

// Removed strict mode to avoid doble rendering in development mode
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
