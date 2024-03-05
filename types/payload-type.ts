export interface LoginPayloadType {
  username: string;
  email?: string;
  password: string;
}

export interface clientDetailType {
  id?: number;
  name: string;
  code?: string;
  address?: string;
  zip_code: string;
  city: string;
  district: string;
  street_name: string;
  tel: string;
  email: string;
  pic_name: string;
  status?: string | number;
  note?: string;
  type?: string;
  updated_at?: string;
}

export interface SalaryType {
  id?: number | null;
  wage: number | string;
  type: number | string;
}
export interface projectDetailType {
  name: string;
  code: string;
  address: string;
  tel: string;
  email: string;
  pic_name: string;
  status?: string | number;
  note?: string;
  type?: string | number;
  id?: number;
  client_id: number;
  client_code: string;
  client_name: string;
  project_name: string;
  manager_name: string;
  project_code: string;
  start_day: string;
  end_day: string;
  amount_of_people: number;
  sales: string;
  notes: string;
  updated_at: string;
  salary: Array<SalaryType>;
  salarys: Array<SalaryType>;
  city?: string;
  province?: string;
  street_name?: string;
  entry_status?: string;
}

export interface StaffType {
  name: string;
  furigana: string;
  birthday: string;
  address: string;
  gender: string | number;
  tel: string;
  status: string;
  last_update: string;
  id?: number;
  email?: string;
  role?: string;
  bank_info?: string;
  bank_branch?: string;
  bank_number?: number;
  line?: string;
  contact?: string;
  password?: string;
  password_confirmation?: string;
}

export interface staffTableDataType {
  id: number;
  entry_status: string | number | boolean;
  hidden_search?: "waiting" | "accepted" | "";
  furigana: string;
  address: string;
  tel: string;
  wage: number;
  cancel: number;
  status: string;
}

export type methodType =
  | "GET"
  | "HEAD"
  | "PATCH"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "get"
  | "head"
  | "patch"
  | "post"
  | "put"
  | "delete"
  | "connect"
  | "options"
  | "trace";

export interface EntryType {
  id: number;
  user_id: number;
  m_project_id: number;
  date: string;
  name?: string;
}
