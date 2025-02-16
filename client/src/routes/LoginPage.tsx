import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../main';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { email, password };
    try {
      const response = await axios.post(`${API_URL}/auth/login`, payload);

      if (response.status.toString().startsWith('2')) {
        toast.success(response.data.message);
        navigate('/blogs');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(
          error.response.data.email ||
            error.response.data.password ||
            error.response.data
        );
      } else {
        toast.error('Something went wrong!');
      }
      console.error('Error submitting login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-full sm:w-[400px] p-5 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-[#2c586a] mb-5">Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label htmlFor="email" className="text-[#2c586a] font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border-2 border-[#2c586a] rounded-lg"
                required
              />
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="text-[#2c586a] font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border-2 border-[#2c586a] rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 bg-[#2c586a] text-[#f3f8f6] font-medium rounded-lg ${
                isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-[#1e4050]'
              }`}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;
