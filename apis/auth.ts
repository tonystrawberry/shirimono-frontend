const baseURL = 'http://localhost:3001'

export const signIn = async (email: string, password: string) => {
  return await $fetch(`${baseURL}/api/v1/auth/sign_in`, {
    method: 'POST',
    body: { email, password },
  })
}

export const signUp = async (email: string, password: string) => {
  return await $fetch(`${baseURL}/api/v1/auth`, {
    method: 'POST',
    body: { email, password },
  })
}
