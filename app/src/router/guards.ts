<<<<<<< HEAD
   router.beforeEach((to) => {
     const auth = useAuthStore()
     if (to.meta.public) return true
     if (to.meta.requiresAuth && !auth.isAuthenticated) {
       return { name: 'admin-login', query: { redirect: to.fullPath } }
     }
     const role = auth.role
     const allowed = to.matched.every((r) => !r.meta.roles || (role && r.meta.roles.includes(role)))
     const permitted = to.matched.every((r) => !r.meta.permission || (role && roleHasPermission(role, r.meta.permission)))
     return allowed && permitted ? true : { name: 'forbidden' }
   })
=======
export default [];
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
