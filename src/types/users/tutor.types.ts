export interface TutorProfile {
  tutor_id: string;
  qualifications: string[];
  payment_details: PaymentDetails;
  user_id: string;
  subject_id: string | null;
  address: string;
  admin: any;
  avatar: string | null;
  contact_no: string;
  dob: string;
  email: string;
  f_name: string;
  l_name: string;
  nic: string;
  user_type: string;
  username: string;
}

export interface PaymentDetails {
  bank_name: string;
  branch_name: string;
  account_no: string;
}
