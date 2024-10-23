import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchType, RootStateType } from '../store';
import { useAppSelector } from '../hooks/storeHook';
import { AuthState, loginUser } from '../features/auth/authSlice';

const Login = () => {

    const dispatch = useDispatch<AppDispatchType>();
    const { loading, error } = useAppSelector((state: RootStateType) => state.auth as AuthState);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({ username, password }));
    };
  return (
    <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    </div>
);
}

export default Login;