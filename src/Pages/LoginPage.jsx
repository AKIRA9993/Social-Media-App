import React, { useState, useContext } from 'react'
import { Input, Button } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../Schema/LoginSchema'
import { sendLoginData } from '../Services/login'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'

export default function LoginPage () {
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext)
  
  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(loginSchema)
  })

  const navigate = useNavigate()

  async function signIn (values) {
    setLoading(true)
    setApiError(null)
    
    const response = await sendLoginData(values)
    setLoading(false)

    if (response.error) {
      setApiError(response.error)
    } else {
      login(response.data.token)
      navigate('/')
    }
  }

  return (
    <div className='w-full min-h-screen  from-blue-50 to-white flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        
        {/* Login Card */}
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-blue-100'>
          
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>Welcome Back</h2>
          <p className='text-gray-600 mb-6'>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit(signIn)} className='flex flex-col gap-4'>
            
            <Input
              label='Email'
              labelPlacement='outside'
              placeholder='you@example.com'
              type='email'
              variant='bordered'
              classNames={{
                label: 'text-gray-700 font-medium',
                input: 'bg-gray-50'
              }}
              isInvalid={Boolean(formState.errors.email?.message)}
              errorMessage={formState.errors.email?.message}
              {...register('email')}
            />

            <Input
              label='Password'
              labelPlacement='outside'
              placeholder='••••••••'
              type='password'
              variant='bordered'
              classNames={{
                label: 'text-gray-700 font-medium',
                input: 'bg-gray-50'
              }}
              isInvalid={Boolean(formState.errors.password?.message)}
              errorMessage={formState.errors.password?.message}
              {...register('password')}
            />

            {apiError && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
                {apiError}
              </div>
            )}

            <Button 
              isLoading={loading} 
              type='submit' 
              color='primary' 
              size='lg' 
              className='w-full  from-blue-500 to-blue-600 text-white font-semibold mt-2'
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className='flex items-center gap-4 my-6'>
            <div className='flex-1 border-t border-gray-300'></div>
            <span className='text-gray-500 text-sm'>or</span>
            <div className='flex-1 border-t border-gray-300'></div>
          </div>

          {/* Sign Up Link */}
          <p className='text-center text-gray-600'>
            Don't have an account?{' '}
            <Link to='/auth/register' className='text-blue-600 font-semibold hover:text-blue-700 transition'>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}