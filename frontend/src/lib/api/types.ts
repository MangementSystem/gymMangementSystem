export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  gender?: string;
  birth_date?: string;
  phone?: string;
  email?: string;
  join_date?: string;
  goal?: string;
  weight?: number;
  height?: number;
  ai_profile?: Record<string, any>;
  created_at: string;
  organization?: Organization;
  memberships?: Membership[];
  attendance_logs?: AttendanceLog[];
  progress?: Progress[];
  workout_programs?: WorkoutProgram[];
  workout_logs?: WorkoutLog[];
}

export interface Organization {
  id: number;
  name: string;
  owner_id?: number;
  address?: string;
  phone?: string;
  created_at: string;
  members?: Member[];
  plans?: Plan[];
  memberships?: Membership[];
  transactions?: Transaction[];
  devices?: AttendanceDevice[];
  logs?: AttendanceLog[];
}

export interface Plan {
  id: number;
  name: string;
  duration_days: number;
  price: number;
  description?: string;
  organization?: Organization;
}

export interface Membership {
  id: number;
  organization?: Organization;
  member?: Member;
  plan?: Plan;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  created_at: string;
}

export interface AttendanceLog {
  id: number;
  organization?: Organization;
  member?: Member;
  device?: AttendanceDevice;
  check_in?: string;
  check_out?: string;
  status?: string;
  notes?: string;
  created_at: string;
}

export interface AttendanceDevice {
  id: number;
  organization?: Organization;
  name: string;
  serial_number: string;
  ip_address?: string;
  status?: string;
  created_at: string;
  logs?: AttendanceLog[];
}

export interface Exercise {
  id: number;
  name: string;
  description?: string;
  category?: string;
  equipment?: string;
  instructions?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WorkoutProgram {
  id: number;
  member?: Member;
  name: string;
  goal?: string;
  created_at: string;
  exercises?: WorkoutProgramExercise[];
  logs?: WorkoutLog[];
}

export interface WorkoutProgramExercise {
  id: number;
  program?: WorkoutProgram;
  exercise?: Exercise;
  sets?: number;
  reps?: number;
  target_weight?: number;
  day_of_week?: string;
}

export interface WorkoutLog {
  id: number;
  member?: Member;
  program?: WorkoutProgram;
  date: string;
  ai_summary?: string;
  created_at: string;
  sets?: WorkoutLogSet[];
  ai_analysis?: AiExerciseAnalysis[];
}

export interface WorkoutLogSet {
  id: number;
  workout_log?: WorkoutLog;
  exercise?: Exercise;
  set_number?: number;
  reps?: number;
  weight?: number;
  rpe?: number;
}

export interface Progress {
  id: number;
  member?: Member;
  date: string;
  weight?: number;
  body_fat?: number;
  muscle_mass?: number;
  ai_feedback?: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  organization?: Organization;
  membership?: Membership;
  member?: Member;
  type: string;
  category: string;
  description?: string;
  amount: number;
  currency?: string;
  payment_method?: string;
  status?: string;
  created_at: string;
}

export interface AiExerciseAnalysis {
  id: number;
  member?: Member;
  workout_log?: WorkoutLog;
  exercise?: Exercise;
  posture_score?: number;
  stability_score?: number;
  movement_efficiency?: number;
  risk_level?: string;
  detected_errors?: Record<string, any>;
  recommended_fix?: string;
  created_at: string;
}

export interface AiInsight {
  id: number;
  member?: Member;
  category?: string;
  input_data?: Record<string, any>;
  ai_recommendation?: string;
  predicted_goal_date?: string;
  risk_alert?: string;
  created_at: string;
}
