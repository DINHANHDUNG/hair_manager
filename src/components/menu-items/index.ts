import categorys from './category'
import dashboard from './dashboard'
import order from './order'
import other from './other'
import payment from './payment'
import utilities from './utilities'

// ==============================|| MENU ITEMS ||============================== //

const menuItems = () => {
  const DEV = process.env.REACT_APP_DEV ?? false
  const listDEV = [utilities, other, order]
  const listStg = [dashboard, order, payment, categorys]
  // const listStg = [dashboard, categorys, salarys]
  return DEV ? [...listStg, ...listDEV] : listStg
}

export default menuItems
