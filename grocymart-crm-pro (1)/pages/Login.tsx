
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@grocymart.com');
  const [password, setPassword] = useState('password123');
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate real auth
    login(email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg shadow-green-200">
            G
          </div>
          <h1 className="text-2xl font-black text-slate-800">GrocyMart CRM</h1>
          <p className="text-slate-400 font-medium">Enterprise Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">Work Email</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all"
              placeholder="name@company.com"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-slate-600">Password</label>
              <button type="button" className="text-xs font-bold text-green-600 hover:underline">Forgot?</button>
            </div>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center gap-2 ml-1 py-2">
            <input type="checkbox" className="w-4 h-4 rounded text-green-600 focus:ring-green-500 border-slate-300" defaultChecked />
            <span className="text-sm text-slate-500 font-medium">Keep me logged in</span>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 shadow-xl shadow-green-100 active:scale-[0.98] transition-all"
          >
            Sign In to Dashboard
          </button>
        </form>

        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          Authorized personnel only. <br/>
          Contact IT for access requests.
        </p>
      </div>
    </div>
  );
};

export default Login;
