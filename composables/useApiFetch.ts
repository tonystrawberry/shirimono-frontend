export const useApiFetch = async (url: string, options: { method: "GET" | "HEAD" | "PATCH" | "POST" | "PUT" | "DELETE", headers?: object } = { method: "GET" }) => {
  const accessToken = localStorage.getItem('access-token')
  const client = localStorage.getItem('client')
  const expiry = localStorage.getItem('expiry')
  const uid = localStorage.getItem('uid')

  try {
    return await $fetch(url, {
      method: options.method,
      headers: {
        ...options.headers,
        'access-token': accessToken || '',
        client: client || '',
        expiry: expiry || '',
        uid: uid || '',
      },
      onResponse({ response }) {
        const headers = response.headers

        if (headers.get('access-token')) {
          localStorage.setItem('access-token', headers.get('access-token')!)
          localStorage.setItem('client', headers.get('client')!)
          localStorage.setItem('expiry', headers.get('expiry')!)
          localStorage.setItem('uid', headers.get('uid')!)
        }
      },
      onResponseError({ response }) {
        if (response.status === 401) {
          navigateTo('/')
        }
      }
    })
  } catch (error) {
    console.log("error", error)
    throw error
  }
}