import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../validation/loginScehma';
import type { LoginSchemaType } from '../validation/loginScehma';
import Input from '../components/Input';
import Button from '../components/ui/Button';

const Login: React.FC = () => {
  const [bgColor, setBgColor] = useState('via-purple-300');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setLoginError('');
    setBgColor('via-purple-300');

    try {
      const response = await axios.post('http://localhost:8081/api/login', {
        username: data.email,
        password: data.password,
      });

      const { username, level } = response.data;

      setBgColor('via-green-100');
      navigate('/landing', { state: { username, level } });
    } catch (error) {
      setBgColor('via-red-300');

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          setLoginError('Invalid credentials');
        } else {
          setLoginError('Login failed. Try again later.');
        }
      } else {
        setLoginError('An unexpected error occurred.');
      }
    }
  };
  

  return (
  <div className="flex items-start justify-end min-h-screen bg-white pt-64 pr-10"
    style={{
      backgroundImage: 'url(/cimplr.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`bg-gradient-to-tr from-blue-400 ${bgColor} to-blue-600 shadow-md rounded-lg px-8 pt-6 pb-8 w-full max-w-sm transition-all duration-300`}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {loginError && (
          <p className="mb-4 text-red-900 font-semibold bg-red-100 px-3 py-2 rounded">
            {loginError}
          </p>
        )}

        <div className="mb-4">
          <Input
            label="Email"
            type="email"
            placeholder="Email"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div className="mb-6">
          <Input
            label="Password"
            type="password"
            placeholder="Password"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>
        <Button color='Blue'>
          Login
        </Button>
        
        

      </form>
    </div>
  );


};

export default Login;
