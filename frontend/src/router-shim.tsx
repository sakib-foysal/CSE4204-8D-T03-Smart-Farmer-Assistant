import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface RouterCtx {
  path: string;
  search: string;
  navigate: (to: string) => void;
}

const Ctx = createContext<RouterCtx>({ path: "/", search: "", navigate: () => {} });

function getBrowserPath() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
}

export function RouterProvider({ children, initialPath }: { children: React.ReactNode; initialPath?: string }) {
  const [path, setPath] = useState(initialPath ?? getBrowserPath());
  const [search, setSearch] = useState(typeof window === "undefined" ? "" : window.location.search);
  const navigate = useCallback((to: string) => {
    const target = new URL(to, window.location.origin);
    setPath(target.pathname);
    setSearch(target.search);
    if (typeof window !== "undefined" && `${window.location.pathname}${window.location.search}` !== `${target.pathname}${target.search}`) {
      window.history.pushState({}, "", to);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => { setPath(getBrowserPath()); setSearch(window.location.search); };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return <Ctx.Provider value={{ path, search, navigate }}>{children}</Ctx.Provider>;
}

export function useNavigate() {
  return useContext(Ctx).navigate;
}

export function useLocation() {
  const { path, search } = useContext(Ctx);
  return { pathname: path, search, hash: "" };
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
export function createMemoryRouter(..._args: unknown[]) { return {}; }
export function createHashRouter() { return {}; }
