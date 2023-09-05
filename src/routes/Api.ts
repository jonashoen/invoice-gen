const Prefix = "/api";

const Api = {
  Authed: "/user/is-authed",
  Login: "/user/login",
  Register: "/user/register",
  VerifyAccount: "/user/verify",
  ResendVerifyCode: "/user/resend-verify-code",
  Logout: "/user/logout",
  GetUser: "/user/get",
  EditUser: "/user/edit",
  ChangePassword: "/user/change-password",
  RequestResetPassword: "/user/request-reset-password",
  CheckResetPasswordCode: "/user/check-reset-password-code",
  ResetPassword: "/user/reset-password",
  Invoices: "/invoices",
  Projects: "/projects",
  Customers: "/customers",
  AddCustomer: "/customers/add",
  EditCustomer: "/customers/edit",
  DeleteCustomer: "/customers/delete",
  AddProject: "/projects/add",
  EditProject: "/projects/edit",
  DeleteProject: "/projects/delete",
  AddInvoice: "/invoices/add",
  EditInvoice: "/invoices/edit",
  LockInvoice: "/invoices/lock",
  DeleteInvoice: "/invoices/delete",
  PublishInvoice: "/invoices/publish",
  ShowInvoice: "/invoices/show",
  TimeTracking: "/time-tracking",
  RunningTimeTrack: "/time-tracking/running",
  StartTimeTracking: "/time-tracking/start",
  StopTimeTracking: "/time-tracking/stop",
  DeleteTimeTracking: "/time-tracking/delete",
  EditTimeTracking: "/time-tracking/edit",
};

export default Api;

export { Prefix };
