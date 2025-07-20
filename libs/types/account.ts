export interface Login {
  email: string;
  password: string;
}

export interface SignUp {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  dob: string;
  phone: string;
  gender: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  gender: string;
  dob: string;
  phone: string;
}

export interface UpdateUser {
  username: string;
  dob: string;
  phone: string;
  gender: string;
}
