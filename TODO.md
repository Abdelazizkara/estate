# TODO - Fix Vite proxy /api/properties ECONNREFUSED

- [ ] Confirm what port backend is actually running on (expected 3001).
- [ ] Fix frontend Vite proxy to target the correct backend port (and avoid misconfiguration when backend is not on 3001).
- [ ] Ensure axios baseURL is not conflicting with Vite proxy.
- [ ] Add a quick /api/health call helper to verify connectivity.
- [ ] Run backend + frontend and validate /api/health and /api/properties.

