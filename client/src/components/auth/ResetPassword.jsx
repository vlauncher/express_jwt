import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../features/Slices/AuthSlice';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, errorMessage } = useSelector((state) => state.auth);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password === confirmPassword) {
      dispatch(resetPassword({ resetToken, password }));
    } else {
      // Passwords do not match
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {isSuccess ? (
        <p>Your password has been reset. You can now log in with your new password.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password">New Password:</label>
            <input type="password" id="password" value={password} onChange={handlePasswordChange} />
          </div>
          <div>
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          {isError && <p>{errorMessage}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
