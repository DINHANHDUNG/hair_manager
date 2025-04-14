const ROUTES = {
  HOME: '/',
  DEFAULT: 'default',
  INDEX: 'index',
  DASHBOARD: 'dashboard',
  ORDER: 'order',
  ORDER_DETAIL: 'order-detail',
  ORDER_ADD: 'order-add',
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
    PARTER: 'partner',
    COMPANY: 'company',
    WORKER: 'worker',
    WORKER_DETAIL: 'worker/:id',
    SALARY_ADVANCE: 'salary-advance',
    SALARY_REFUND: 'salary-refund',
    SALARY_PAY_STAFF: 'salary-pay/staff',
    SALARY_PAY_EMPLOYEE: 'salary-pay/employee'
  }
}

export default ROUTES
