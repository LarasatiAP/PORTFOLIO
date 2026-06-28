import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';

export const metadata = {
  title: 'Admin Panel | Portfolio',
  description: 'Manage your portfolio projects and experience',
};

export default async function AdminLayout({ children }) {
  const session = await getSession();

  // Check if we're on the login page by inspecting the URL
  // Layout wraps all admin pages including login
  // We handle auth redirect in the shell component for non-login pages

  return <AdminShell session={session}>{children}</AdminShell>;
}
