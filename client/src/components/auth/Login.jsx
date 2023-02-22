import { useState, useEffect } from "react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate,Link } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../../features/Slices/AuthSlice";
import Spinner from "../../layouts/Spinner";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="login-header">
          <h2 className="text-center p-4">Login</h2>
        </div>
        <div className="login-card" style={{ width:'45%',margin:'auto' }}>
          <div className="card">
            <div className="card-body">
              <form autoComplete="off" onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onChange}
                  />
                </div>
                <div className="d-grid gap-2">
                  <button className="btn btn-dark" type="submit">
                    Login
                  </button>
                </div>
              </form>
              <p>Forgot your password <Link to={"/request-password-reset"}>Reset Password</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;