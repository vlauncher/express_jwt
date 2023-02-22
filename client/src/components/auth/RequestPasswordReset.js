import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestPasswordReset } from '../../features/Slices/AuthSlice';
import { useNavigate } from "react-router-dom";


function RequestPasswordReset() {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { message, isLoading,isSuccess} = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(requestPasswordReset(email));
    if(isSuccess){
        navigate("/");
    }
    if (!email) {
        setFormError('Email and password are required');
        return;
      }
  };

  return (
    <div>
      <h2>Request Password Reset</h2>
      {message && <p>Error: {message}</p>}
      {formError && <p>Error: {formError}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <button type="submit" className='btn btn-success' disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default RequestPasswordReset;
