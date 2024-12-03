'use client'

import { signInUser } from '@/app/actions/authActions'
import { loginSchema, LoginSchema } from '@/lib/schemas/loginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { handleFormServerErrors } from '@/lib/utils'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { GiPadlock } from 'react-icons/gi'
import { toast } from 'react-hot-toast'

const LoginForm = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  })

  const onSubmit = async (data: LoginSchema) => {
    const result = await signInUser(data)
    if (result.status === 'success') {
      router.push('/')
      router.refresh()
    } else {
      toast.error(result.error as string)
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
            <h1 className='text-3xl font-LatoBold text-black'>Login</h1>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
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

            <Button
              isLoading={isSubmitting}
              isDisabled={!isValid}
              fullWidth
              className='bg-jcb font-LatoBold'
              type='submit'
            >
              Login
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}

export default LoginForm
