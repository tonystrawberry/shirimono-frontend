import { useUsersStore } from '~/stores/users'

export default defineNuxtRouteMiddleware(async (to) => {
  const usersStore = useUsersStore()

  try {
    console.log('fetching user')
    await usersStore.getUser()
    console.log('user state:', usersStore.currentUser)
    console.log('isAuthenticated:', usersStore.isAuthenticated)

    // If user is logged in and tries to access auth pages, redirect to app home
    if (usersStore.isAuthenticated && to.path.startsWith('/auth')) {
      return navigateTo('/app/courses')
    }

    // If user is not logged in and tries to access app pages, redirect to home
    if (!usersStore.isAuthenticated && to.path.startsWith('/app')) {
      return navigateTo('/')
    }
  } catch (error) {
    console.error('Error in auth middleware:', error)
    // If there's an error fetching user (like invalid/expired token), treat as logged out
    usersStore.clearUser()
    if (to.path.startsWith('/app')) {
      return navigateTo('/')
    }
  }
})