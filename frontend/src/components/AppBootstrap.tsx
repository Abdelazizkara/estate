import { useEffect, useState, type ReactNode } from 'react';
import { fetchProperties } from '../services/properties';
import { usePropertyStore } from '../store/usePropertyStore';
import { useUserStore } from '../store/useUserStore';

interface AppBootstrapProps {
  children: ReactNode;
}

export function AppBootstrap({ children }: AppBootstrapProps) {
  const setProperties = usePropertyStore((s) => s.setProperties);
  const restoreSession = useUserStore((s) => s.restoreSession);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [properties] = await Promise.all([
          fetchProperties(),
          restoreSession(),
        ]);
        if (!cancelled) {
          setProperties(properties);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError('Could not load properties. Is the API running on port 3001?');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [setProperties, restoreSession]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-sm text-gray-600">
            Start the backend: <code className="bg-gray-100 px-1 rounded">cd backend && npm run dev</code>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
