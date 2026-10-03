// frontend/src/pages/DashboardPage.jsx
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        Welcome back, {user?.name}
      </h1>
      
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <p className="text-slate-600 dark:text-slate-400">
          This is your dashboard. The layout shell (sidebar + header) is now handling navigation.
        </p>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-950 rounded-lg text-sm text-slate-800 dark:text-slate-300 overflow-x-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}
