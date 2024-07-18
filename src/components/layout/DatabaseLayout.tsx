import { Outlet } from 'react-router-dom'

const DatabaseLayout = () => {
  return (
    <div>
      <header>Database Header</header>
      <main>
        <Outlet />
      </main>
      <footer>Database Footer</footer>
    </div>
  )
}

export default DatabaseLayout
