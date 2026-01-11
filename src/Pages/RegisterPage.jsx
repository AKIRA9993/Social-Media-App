import React, { useState } from 'react'
import { Input, Select, SelectItem, Button } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendRegisterData } from '../Services/register'
import { useNavigate, Link } from 'react-router-dom'
import { registerSchema } from '../Schema/RegisterSchema'

export default function RegisterPage () {

  const [apiError, setApiError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      dateOfBirth: '',
      gender: ''
    },
    resolver: zodResolver(registerSchema)
  })

  const navigate = useNavigate()

  async function signUp (values) {
    setLoading(true)
    setApiError(null)
    
    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth instanceof Date 
        ? values.dateOfBirth.toISOString().split('T')[0]
        : values.dateOfBirth
    }
    
    const response = await sendRegisterData(formattedValues)

    setLoading(false)

    if (response.error) {
      setApiError(response.error)
    } else {
      navigate('/auth/login')
    }
  }

  return (
    <div className='w-full min-h-screen  from-blue-50 to-white flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        
        {/* Register Card */}
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-blue-100'>
          
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>Join Us</h2>
          <p className='text-gray-600 mb-6'>Create your account to get started</p>

          <form onSubmit={handleSubmit(signUp)} className='flex flex-col gap-4'>
            
            <Input
              label='Full Name'
              labelPlacement='outside'
              placeholder='John Doe'
              variant='bordered'
              classNames={{
                label: 'text-gray-700 font-medium',
                input: 'bg-gray-50'
              }}
              isInvalid={Boolean(formState.errors.name?.message)}
              errorMessage={formState.errors.name?.message}
              {...register('name')}
            />

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

            <Input
              label='Confirm Password'
              labelPlacement='outside'
              placeholder='••••••••'
              type='password'
              variant='bordered'
              classNames={{
                label: 'text-gray-700 font-medium',
                input: 'bg-gray-50'
              }}
              isInvalid={Boolean(formState.errors.rePassword?.message)}
              errorMessage={formState.errors.rePassword?.message}
              {...register('rePassword')}
            />

            {/* Date and Gender fields */}
            <div className='grid grid-cols-2 gap-3'>
              <Input
                label='Date of Birth'
                labelPlacement='outside'
                type='date'
                variant='bordered'
                classNames={{
                  label: 'text-gray-700 font-medium text-sm',
                  input: 'bg-gray-50'
                }}
                isInvalid={Boolean(formState.errors.dateOfBirth?.message)}
                errorMessage={formState.errors.dateOfBirth?.message}
                {...register('dateOfBirth')}
              />

              <Select
                label='Gender'
                labelPlacement='outside'
                variant='bordered'
                classNames={{
                  label: 'text-gray-700 font-medium text-sm',
                  trigger: 'bg-gray-50'
                }}
                isInvalid={Boolean(formState.errors.gender?.message)}
                errorMessage={formState.errors.gender?.message}
                {...register('gender')}
              >
                <SelectItem key='male'>Male</SelectItem>
                <SelectItem key='female'>Female</SelectItem>
                <SelectItem key='other'>Other</SelectItem>
              </Select>
            </div>

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
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className='flex items-center gap-4 my-6'>
            <div className='flex-1 border-t border-gray-300'></div>
            <span className='text-gray-500 text-sm'>or</span>
            <div className='flex-1 border-t border-gray-300'></div>
          </div>

          {/* Sign In Link */}
          <p className='text-center text-gray-600'>
            Already have an account?{' '}
            <Link to='/auth/login' className='text-blue-600 font-semibold hover:text-blue-700 transition'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}