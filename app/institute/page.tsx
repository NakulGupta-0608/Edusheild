import { redirect } from 'next/navigation';

export default function InstituteIndex() {
  // Automatically redirect the base /institute route to the dashboard
  redirect('/institute/dashboard');
}
