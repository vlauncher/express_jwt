import { useState, useEffect } from "react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { changePassword } from "../../features/Slices/AuthSlice";
import Spinner from "../../layouts/Spinner";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const { currentPassword, newPassword } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      navigate("/");
    }
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
      currentPassword,
      newPassword,
    };

    dispatch(changePassword(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="login-header">
          <h2 className="text-center p-4">Change Password</h2>
        </div>
        <div className="login-card" style={{ width:'45%',margin:'auto' }}>
          <div className="card">
            <div className="card-body">
              <form autoComplete="off" onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">currentPassword</label>
                  <input
                    type="password"
                    className="form-control"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">newPassword</label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    value={newPassword}
                    onChange={onChange}
                  />
                </div>
                <div className="d-grid gap-2">
                  <button className="btn btn-dark" type="submit">
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;