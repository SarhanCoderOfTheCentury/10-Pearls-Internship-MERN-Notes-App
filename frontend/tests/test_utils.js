import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

/**
 * Renders a component inside a MemoryRouter so that any
 * component that uses useNavigate / useLocation / Link works without crashing.
 *
 * @param {JSX.Element} ui - Component to render
 * @param {{ initialEntries?: string[], routerProps?: object }} options
 */
export function renderWithRouter(ui, { initialEntries = ['/'], ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Mocked AuthContext value factory.
 * Pass overrides to customise per-test.
 */
export function createMockAuthContext(overrides = {}) {
  return {
    user: null,
    loading: false,
    loginUser: vi.fn().mockResolvedValue(true),
    registerUser: vi.fn().mockResolvedValue(undefined),
    logoutUser: vi.fn().mockResolvedValue(undefined),
    updateProfile: vi.fn().mockResolvedValue(undefined),
    getProfile: vi.fn().mockReturnValue(null),
    isAuthenticated: false,
    ...overrides,
  };
}
