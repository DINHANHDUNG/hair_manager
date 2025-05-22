const ROUTES = {
  HOME: '/',
  DEFAULT: 'default',
  INDEX: 'index',
  DASHBOARD: 'dashboard',
  DASHBOARD_ORDER: 'dashboard-order',
  DASHBOARD_ORDER_SALE: 'dashboard-order-sale',
  ORDER: 'order',
  ORDER_DETAIL: 'order-detail',
  ORDER_ADD: 'order-add',
  ORDER_REQUEST: 'order-request',
  ORDER_CANCEL: 'order-cancel',
  LOGIN: 'login',
  NOT_AUTHORIZED: 'not-authorized',
  SAMPLE_PAGE: 'sample-page',
  UTILS: 'utils',
  // Add more routes here as needed
  UTILS_CHILD: {
    TYPOGRAPHY: 'util-typography',
    COLOR: 'util-color',
    SHADOW: 'util-shadow',
    INPUT: 'util-input'
    // Add more utility routes here as needed
  },
  CATEGORY: 'category',
  CATEGORY_CHILD: {
    STAFF: 'staff',
    STAFF_DETAIL: 'staff/:id',
    PARTER: 'customer',
    COMPANY: 'company',
    WORKER: 'worker',
    WORKER_DETAIL: 'worker/:id',
    SALARY_ADVANCE: 'salary-advance',
    SALARY_REFUND: 'salary-refund',
    SALARY_PAY_STAFF: 'salary-pay/staff',
    SALARY_PAY_EMPLOYEE: 'salary-pay/employee',
    ACCOUNT_MANAGER: 'account_manager',
    CUSTOMER_MANAGER: 'customer_manager'
  },
  PAYMENT: 'payment',
  PAYMENT_APPROVE: 'approve'
}

export default ROUTES
