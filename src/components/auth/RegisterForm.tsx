'use client'

import { registerUser } from '@/app/actions/authActions'
import { RegisterSchema, registerSchema } from '@/lib/schemas/registerSchema'
import { handleFormServerErrors } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import { GiPadlock } from 'react-icons/gi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const RegisterForm = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  })

  const onSubmit = async (data: RegisterSchema) => {
    const result = await registerUser(data)
    if (result.status === 'success') {
      toast.success('Registered successfully')
      router.push('/register/success')
    } else {
      handleFormServerErrors(result, setError)
    }

    // console.log(data)
  }

  return (
    <Card className='w-4/5 md:w-3/5 lg:w-4/12 mx-auto'>
      <CardHeader className='flex fles-col items-center justify-center'>
        <div className='flex flex-col gap-2 items-center text-secondary'>
          <div className='flex items-center gap-3'>
            <GiPadlock size={30} className='text-jcb' />
            <h1 className='text-3xl font-semibold text-black'>Sign Up</h1>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <Input
              defaultValue=''
              label='Full Name'
              variant='bordered'
              {...register('name')}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
            <Input
              defaultValue=''
              label='Email'
              variant='bordered'
              {...register('email')}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
            <Input
              defaultValue=''
              label='Password'
              type='password'
              variant='bordered'
              {...register('password')}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
            {errors.root?.serverError && (
              <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
            )}
            <Button
              isDisabled={!isValid}
              fullWidth
              type='submit'
              isLoading={isSubmitting}
              className='bg-jcb font-LatoBold'
            >
              Sign Up
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}

export default RegisterForm
