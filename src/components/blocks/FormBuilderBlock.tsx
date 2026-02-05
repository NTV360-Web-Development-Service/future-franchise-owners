'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Turnstile } from '@/components/ui/turnstile'
import { Loader2 } from 'lucide-react'

interface FormField {
  fieldType: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select'
  label: string
  name: string
  placeholder?: string | null
  required?: boolean | null
  width: 'full' | 'half' | 'third'
  options?: Array<{ label: string; value: string }> | null
  id?: string | null
}

interface FormBuilderBlockProps {
  block: {
    published?: boolean | null
    heading?: string | null
    description?: string | null
    formFields?: FormField[] | null
    submitButtonText?: string | null
    successMessage?: string | null
    anchorId?: string | null
    id?: string | null
    blockName?: string | null
    blockType?: string
  }
}

interface FormData {
  [key: string]: string
}

interface FormErrors {
  [key: string]: string
}

export const FormBuilderBlock: React.FC<FormBuilderBlockProps> = ({ block }) => {
  const heading = block.heading || 'Get in Touch'
  const description = block.description
  const submitButtonText = block.submitButtonText || 'Send Message'
  const successMessage = block.successMessage || "Thank you! We'll get back to you soon."
  const formFields = block.formFields || []

  const [formData, setFormData] = useState<FormData>({})
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  // Stable callbacks for Turnstile to prevent re-renders
  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null)
  }, [])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    formFields.forEach((field) => {
      const value = formData[field.name] || ''

      if (field.required && !value.trim()) {
        newErrors[field.name] = `${field.label} is required`
      } else if (field.fieldType === 'email' && value.trim() && !validateEmail(value)) {
        newErrors[field.name] = 'Please enter a valid email address'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!turnstileToken) {
      setErrorMessage('Please complete the security verification')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setIsSuccess(true)
      setFormData({})
      setTurnstileToken(null)
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const getWidthClass = (width: string) => {
    switch (width) {
      case 'half':
        return 'w-full md:w-1/2'
      case 'third':
        return 'w-full md:w-1/3'
      default:
        return 'w-full'
    }
  }

  const renderField = (field: FormField) => {
    const fieldId = `field-${field.name}`
    const hasError = !!errors[field.name]
    const value = formData[field.name] || ''

    const commonProps = {
      id: fieldId,
      name: field.name,
      value,
      onChange: handleChange,
      placeholder: field.placeholder || undefined,
      className: hasError ? 'border-red-500' : '',
      'aria-required': field.required || undefined,
      'aria-invalid': hasError || undefined,
      'aria-describedby': hasError ? `${fieldId}-error` : undefined,
    }

    let inputElement

    switch (field.fieldType) {
      case 'textarea':
        inputElement = <Textarea {...commonProps} rows={4} />
        break
      case 'select':
        inputElement = (
          <select
            {...commonProps}
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${hasError ? 'border-red-500' : ''}`}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
        break
      default:
        inputElement = <Input {...commonProps} type={field.fieldType} />
    }

    return (
      <div key={field.name} className={`${getWidthClass(field.width)} px-2 mb-6`}>
        <Label htmlFor={fieldId} className="text-gray-700 mb-2 block">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </Label>
        {inputElement}
        {hasError && (
          <p id={`${fieldId}-error`} className="text-red-500 text-sm mt-1" role="alert">
            {errors[field.name]}
          </p>
        )}
      </div>
    )
  }

  if (isSuccess) {
    return (
      <section className="bg-white py-16" {...(block.anchorId && { id: block.anchorId })}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-700">{successMessage}</p>
              <Button
                onClick={() => setIsSuccess(false)}
                className="mt-6 bg-[#004AAD] hover:bg-[#003A8C] text-white"
              >
                Send Another Message
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-16" {...(block.anchorId && { id: block.anchorId })}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{heading}</h2>
            {description && <p className="text-lg text-gray-600">{description}</p>}
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-8 shadow-sm">
            <div className="flex flex-wrap -mx-2">{formFields.map(renderField)}</div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6" role="alert">
                <p className="text-red-700">{errorMessage}</p>
              </div>
            )}

            {/* Turnstile CAPTCHA */}
            <div className="flex justify-center mb-6 px-2">
              <Turnstile
                onVerify={handleTurnstileVerify}
                onExpire={handleTurnstileExpire}
                theme="light"
                size="normal"
              />
            </div>

            <div className="px-2">
              <Button
                type="submit"
                disabled={isLoading || !turnstileToken}
                className="w-full bg-[#004AAD] hover:bg-[#003A8C] text-white py-3 text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default FormBuilderBlock
