const prefix = "/api";

const Api = {
  Authed: "/user/is-authed",
  Login: "/user/login",
  Register: "/user/register",
  Logout: "/user/logout",
  GetUser: "/user/get",
  EditUser: "/user/edit",
  ChangePassword: "/user/change-password",
  Invoices: "/invoices",
  Projects: "/projects",
  Customers: "/customers",
  AddCustomer: "/customers/add",
  EditCustomer: "/customers/edit",
  DeleteCustomer: "/customers/delete",
  AddProject: "/projects/add",
  EditProject: "/projects/edit",
  DeleteProject: "/projects/delete",
};

export default Api;

export { prefix };
