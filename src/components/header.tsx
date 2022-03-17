import Link from "next/link";
import Head from "next/head";
import { Get_page_ids } from "./page_ids";
import { Sitename, Me } from "./names";
import React from "react";

function makelink(value, { pagename }) {
  const str = value.slice(0, 1).toUpperCase() + value.slice(1);
  const c = ["hover:text-pink-500"].join(" ");

  return (
    <Link href={`/${Get_page_ids(value)}`}>
      <a className={c}> {str} </a>
    </Link>
  );
}

function Menu(pagename) {
  const about = makelink("about", pagename);
  const works = makelink("works", pagename);
  const blog = makelink("blog", pagename);

  return (
    <p className="text-l mt-1">
      {about} / {works} / {blog}
    </p>
  );
}

export default function Header({ pagename }: { pagename: string }): JSX.Element {
  return (
    <header>
      <Head>
        <link rel="icon" href="/profile.png" />
        <title>{pagename == "home" ? Sitename : Sitename + " | " + pagename}</title>
        <meta name="description" content={Me + "'s website."} />
      </Head>
      <div className="h-30 w-full py-10 ">
        <h1 className={["font-bold", "text-4xl", "inline-block"].join(" ")}>
          <Link href={`/${Get_page_ids("home")}`}>
            <a> {Sitename} </a>
          </Link>
        </h1>
        <Menu pagename={pagename} />
      </div>
    </header>
  );
}
