import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface RouterCtx {
  path: string;
  navigate: (to: string) => void;
}

const Ctx = createContext<RouterCtx>({ path: "/", navigate: () => {} });

function getBrowserPath() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
}

export function RouterProvider({ children, initialPath }: { children: React.ReactNode; initialPath?: string }) {
  const [path, setPath] = useState(initialPath ?? getBrowserPath());
  const navigate = useCallback((to: string) => {
    setPath(to);
    if (typeof window !== "undefined" && window.location.pathname !== to) {
      window.history.pushState({}, "", to);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => setPath(getBrowserPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return <Ctx.Provider value={{ path, navigate }}>{children}</Ctx.Provider>;
}

export function useNavigate() {
  return useContext(Ctx).navigate;
}

export function useLocation() {
  const { path } = useContext(Ctx);
  return { pathname: path, search: "", hash: "" };
}

export function Link({
  to,
  children,
  className,
  ...rest
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  [k: string]: unknown;
}) {
  const navigate = useNavigate();
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => { e.preventDefault(); navigate(to); }}
      {...rest}
    >
      {children}
    </a>
  );
}

// Stub — not used when App.tsx does its own path→component mapping
export function Outlet() { return null; }
export function createBrowserRouter() { return {}; }
export function createMemoryRouter() { return {}; }
export function createHashRouter() { return {}; }
