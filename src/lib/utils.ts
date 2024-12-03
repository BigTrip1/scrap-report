import { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ZodIssue } from 'zod'

export function handleFormServerErrors<TFieldvalues extends FieldValues>(
  errorResponse: {
    error: string | ZodIssue[]
  },
  setError: UseFormSetError<TFieldvalues>
) {
  if (Array.isArray(errorResponse.error)) {
    errorResponse.error.forEach((e) => {
      const fieldName = e.path.join('.') as Path<TFieldvalues>
      setError(fieldName, { message: e.message })
    })
  } else {
    setError('root.serverError', { message: errorResponse.error })
  }
}

export const fetcher = async (url: string, options: RequestInit = {}): Promise<any> => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  try {
    return await response.json()
  } catch (error) {
    return null
  }
}
