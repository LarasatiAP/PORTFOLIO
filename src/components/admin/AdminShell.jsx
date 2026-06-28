'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import styles from '@/styles/admin.module.css';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin',            icon: <LayoutDashboard size={18} /> },
  { label: 'Projects',  href: '/admin/projects',   icon: <FolderKanban size={18} /> },
  { label: 'Experience',href: '/admin/experience', icon: <Briefcase size={18} /> },
  { label: 'Settings',  href: '/admin/settings',   icon: <Settings size={18} /> },
];

export default function AdminShell({ session, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = pathname === '/admin/login';

  // Don't show sidebar on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not logged in and not on login page, redirect
  if (!session) {
    if (typeof window !== 'undefined') {
      router.push('/admin/login');
    }
    return (
      <div className={styles.loginPage}>
        <p style={{ color: 'var(--text-tertiary)' }}>Redirecting to login...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>Portfolio</div>
          <div className={styles.sidebarTag}>Admin Panel</div>
        </div>

        <nav className={styles.sidebarNav}>
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.sidebarLink} ${
                pathname === link.href ? styles.sidebarLinkActive : ''
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.sidebarLink}>
            <ArrowLeft size={18} />
            Back to Site
          </Link>
          <button className={styles.sidebarLink} onClick={handleLogout} style={{ color: '#ef4444' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className={styles.adminMain}>
        {children}
      </main>

      <button
        className={styles.mobileSidebarToggle}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </div>
  );
}
