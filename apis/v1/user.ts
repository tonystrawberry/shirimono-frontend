const baseURL = 'http://localhost:3001'

export const getUser = async () => {
  return await useApiFetch(`${baseURL}/api/v1/user`, {
    method: 'GET'
  })
}