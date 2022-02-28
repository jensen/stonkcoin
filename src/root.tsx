import type { ReactNode } from "react";
import type { MetaFunction } from "remix";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";

import styles from "./styles/main.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => {
  return { title: "stonk/coin" };
};

interface ILayoutInterface {
  children: ReactNode;
}

function Layout(props: ILayoutInterface) {
  return (
    <main className="h-full flex flex-col">
      <header className="px-4 py-2 text-white bg-purple-400">
        <span className="font-bold text-4xl">stonks</span>
      </header>
      <section className="flex-1 container mx-auto flex flex-col justify-center">
        {props.children}
      </section>
    </main>
  );
}

export default function Document() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
