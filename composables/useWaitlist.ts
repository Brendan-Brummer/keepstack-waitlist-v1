/**
 * Waitlist form composable
 *
 * Handles form state, validation, and submission for the waitlist signup.
 */
export const useWaitlist = () => {
  const loading = ref(false)
  const success = ref(false)
  const error = ref<string | null>(null)

  const name = ref('')
  const email = ref('')

  /**
   * Validates email format
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validates the form inputs
   */
  const validateForm = (): boolean => {
    error.value = null

    if (!email.value.trim()) {
      error.value = 'Email is required'
      return false
    }

    if (!isValidEmail(email.value)) {
      error.value = 'Please enter a valid email address'
      return false
    }

    return true
  }

  /**
   * Submits the waitlist form
   */
  const submitForm = async (): Promise<void> => {
    if (!validateForm()) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: apiError } = await useFetch('/api/waitlist', {
        method: 'POST',
        body: {
          name: name.value.trim() || null,
          email: email.value.trim().toLowerCase(),
        },
      })

      if (apiError.value) {
        throw new Error(apiError.value.data?.message || 'Failed to join waitlist. Please try again.')
      }

      success.value = true
      // Clear form
      name.value = ''
      email.value = ''
    } catch (err) {
      console.error('Waitlist submission error:', err)
      error.value = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
    } finally {
      loading.value = false
    }
  }

  /**
   * Resets the form state
   */
  const resetForm = (): void => {
    name.value = ''
    email.value = ''
    error.value = null
    success.value = false
    loading.value = false
  }

  return {
    // State
    name,
    email,
    loading,
    success,
    error,
    // Methods
    submitForm,
    resetForm,
  }
}
