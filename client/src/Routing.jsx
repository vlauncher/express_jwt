import React from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";
import Navbar from "./layouts/Navbar";
import Home from "./components/Home";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

const Routing = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Switch>
          <Route element={<Home />} path={"/"} />
          <Route element={<Register />} path={"/register"} />
          <Route element={<Login />} path={"/login"} />
        </Switch>
      </Router>
    </div>
  );
};

export default Routing;