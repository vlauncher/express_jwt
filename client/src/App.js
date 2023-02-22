import React from 'react'
import "./App.css"
import { Routes ,Route } from "react-router-dom"
import Navbar from "./layouts/Navbar"
import Home from "./components/Home"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Error from "./components/Error"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ChangePassword from './components/auth/ChangePassword'
import RequestPasswordReset from './components/auth/RequestPasswordReset'
import ResetPassword from './components/auth/ResetPassword'

const App = () => {
  return (
    <div className='App'>
      <Navbar/>
      <Routes>
          <Route element={<Home/>} path={"/"} />
          <Route element={<Register/>} path={"/register"} />
          <Route element={<Login/>} path={"/login"} />
          <Route element={<ChangePassword/>} path={"/change-password"} />
          <Route element={<RequestPasswordReset/>} path={"/request-password-reset"} />
          <Route element={<ResetPassword/>} path={"/reset-password/:token"} />
          <Route element={<Error/>} path={"*"} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App