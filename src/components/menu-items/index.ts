import categorys from './category'
import dashboard from './dashboard'
import other from './other'
import utilities from './utilities'

// ==============================|| MENU ITEMS ||============================== //

const menuItems = () => {
  const DEV = process.env.REACT_APP_DEV ?? false
  const listDEV = [utilities, other]
  const listStg = [dashboard, categorys]
  return DEV ? [...listStg, ...listDEV] : listStg
}

export default menuItems
