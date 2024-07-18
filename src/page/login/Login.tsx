import { FormEvent, useState } from 'react'
import { useLoginMutation } from '../../app/services/auth'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login, { isLoading }] = useLoginMutation()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await login({ username, password }).unwrap()
    } catch (err) {
      console.error('Failed to login', err)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type='submit' disabled={isLoading}>
          Login
        </button>
        {/* {error && error?.data && <p>{error?.data}</p>} */}
      </form>
    </div>
  )
}

export default Login
