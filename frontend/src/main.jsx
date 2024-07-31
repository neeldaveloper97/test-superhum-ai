import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgb(67 56 202)",
            padding: "10px 15px",
            color: "#fff",
            borderRadius: "50px",
          },
        }}
      />
      <App />
    </BrowserRouter>
  </>
);
