import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { GlobalContextProviders } from "./components/_globalContextProviders";
import Page_0 from "./pages/menu.tsx";
import PageLayout_0 from "./pages/menu.pageLayout.tsx";
import Page_1 from "./pages/about.tsx";
import PageLayout_1 from "./pages/about.pageLayout.tsx";
import Page_2 from "./pages/admin.tsx";
import PageLayout_2 from "./pages/admin.pageLayout.tsx";
import Page_3 from "./pages/login.tsx";
import PageLayout_3 from "./pages/login.pageLayout.tsx";
import Page_4 from "./pages/staff.tsx";
import PageLayout_4 from "./pages/staff.pageLayout.tsx";
import Page_5 from "./pages/_index.tsx";
import PageLayout_5 from "./pages/_index.pageLayout.tsx";
import Page_6 from "./pages/services.tsx";
import PageLayout_6 from "./pages/services.pageLayout.tsx";

class ErrorBoundary extends React.Component
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

import "./base.css";


const fileNameToRoute = new Map([["./pages/menu.tsx","/menu"],["./pages/about.tsx","/about"],["./pages/admin.tsx","/admin"],["./pages/login.tsx","/login"],["./pages/staff.tsx","/staff"],["./pages/_index.tsx","/"],["./pages/services.tsx","/services"]]);
const fileNameToComponent = new Map([
    ["./pages/menu.tsx", Page_0],
["./pages/about.tsx", Page_1],
["./pages/admin.tsx", Page_2],
["./pages/login.tsx", Page_3],
["./pages/staff.tsx", Page_4],
["./pages/_index.tsx", Page_5],
["./pages/services.tsx", Page_6],
  ]);

function makePageRoute(filename: string) {
  const Component = fileNameToComponent.get(filename);
  return <Component />;
}

function toElement({
  trie,
  fileNameToRoute,
  makePageRoute,
}: {
  trie: LayoutTrie;
  fileNameToRoute: Map<string, string>;
  makePageRoute: (filename: string) => React.ReactNode;
}) {
  return [
    ...trie.topLevel.map((filename) => (
      <Route
        key={fileNameToRoute.get(filename)}
        path={fileNameToRoute.get(filename)}
        element={makePageRoute(filename)}
      />
    )),
    ...Array.from(trie.trie.entries()).map(([Component, child], index) => (
      <Route
        key={index}
        element={
          <Component>
            <Outlet />
          </Component>
        }
      >
        {toElement({ trie: child, fileNameToRoute, makePageRoute })}
      </Route>
    )),
  ];
}

type LayoutTrieNode = Map<
  React.ComponentType<{ children: React.ReactNode }>,
  LayoutTrie
>;
type LayoutTrie = { topLevel: string[]; trie: LayoutTrieNode };
function buildLayoutTrie(layouts: {
  [fileName: string]: React.ComponentType<{ children: React.ReactNode }>[];
}): LayoutTrie {
  const result: LayoutTrie = { topLevel: [], trie: new Map() };
  Object.entries(layouts).forEach(([fileName, components]) => {
    let cur: LayoutTrie = result;
    for (const component of components) {
      if (!cur.trie.has(component)) {
        cur.trie.set(component, {
          topLevel: [],
          trie: new Map(),
        });
      }
      cur = cur.trie.get(component)!;
    }
    cur.topLevel.push(fileName);
  });
  return result;
}

function NotFound() {
  return (
    <div>
      <h1>Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <p>Go back to the <a href="/" style={{ color: 'blue' }}>home page</a>.</p>
    </div>
  );
}
   
export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <GlobalContextProviders>
          <Routes>
            {toElement({ trie: buildLayoutTrie({
"./pages/menu.tsx": PageLayout_0,
"./pages/about.tsx": PageLayout_1,
"./pages/admin.tsx": PageLayout_2,
"./pages/login.tsx": PageLayout_3,
"./pages/staff.tsx": PageLayout_4,
"./pages/_index.tsx": PageLayout_5,
"./pages/services.tsx": PageLayout_6,
}), fileNameToRoute, makePageRoute })} 
            <Route path="*" element={<NotFound />} />
          </Routes>
        </GlobalContextProviders>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
