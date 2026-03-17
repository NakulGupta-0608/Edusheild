import { redirect } from 'next/navigation';

export default function AdminIndex() {
  // Automatically redirect the base /admin route to the dashboard
  redirect('/admin/dashboard');
}
