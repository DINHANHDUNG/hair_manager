import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../app/store'

const UnauthenticatedRoute = () => {
  const auth = useSelector((state: RootState) => state.auth)

  if (auth.accessToken) {
    return <Navigate to='/' />
  }

  return <Outlet />
}

export default UnauthenticatedRoute
