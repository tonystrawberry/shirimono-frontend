const baseURL = 'http://localhost:3001'

export const signIn = async (email: string, password: string) => {
  return await $fetch(`${baseURL}/api/v1/auth/sign_in`, {
    method: 'POST',
    body: { email, password },

    onResponse({ response }) {
      const headers = response.headers

      const accessToken = headers.get('access-token')
      const client = headers.get('client')
      const uid = headers.get('uid')
      const expiry = headers.get('expiry')

      if (accessToken && client && uid && expiry) {
        localStorage.setItem('access-token', accessToken)
        localStorage.setItem('client', client)
        localStorage.setItem('uid', uid)
        localStorage.setItem('expiry', expiry)
      }
    }

  })
}

export const signUp = async (email: string, password: string) => {
  return await $fetch(`${baseURL}/api/v1/auth`, {
    method: 'POST',
    body: { email, password },
    onResponse({ response }) {
      const headers = response.headers

      const accessToken = headers.get('access-token')
      const client = headers.get('client')
      const uid = headers.get('uid')
      const expiry = headers.get('expiry')

      if (accessToken && client && uid && expiry) {
        localStorage.setItem('access-token', accessToken)
        localStorage.setItem('client', client)
        localStorage.setItem('uid', uid)
        localStorage.setItem('expiry', expiry)
      }
    }
  })
}
