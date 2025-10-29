import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://yzbpauwiwjehjbclbnwr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6YnBhdXdpd2plaGpiY2xibndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MzUwODMsImV4cCI6MjA3NzMxMTA4M30.JAwBrmk45mW14KNcqaIScO7HVpI_Rm657MArNpIEwQs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
