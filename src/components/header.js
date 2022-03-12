import Link from "next/link";
import Head from "next/head";
import { Get_page_ids } from "./page_ids";
import { Sitename, Me } from "../components/names";

const color = "bg-pink-400";

function makelink(value, { pagename }) {
    const string = value.slice(0, 1).toUpperCase() + value.slice(1);
    const hover_color =
        string == pagename
            ? [`${color}`, "hover:bg-transparent"].join(" ")
            : [`hover:${color}`, "bg-transparent"].join(" ");

    const c = [hover_color].join("");

    return (
        <Link href={`/${Get_page_ids(value)}`}>
            <a className={c}>{string}</a>
        </Link>
    );
}

function Menu(pagename) {
    const about = makelink("about", pagename);
    const works = makelink("works", pagename);
    const blog = makelink("blog", pagename);

    return (
        <h1 className="text-l mt-1">
            {about} / {works} / {blog}
        </h1>
    );
}

export default function Header({ pagename }) {
    return (
        <header>
            <Head>
                <link rel="icon" href="/profile.png" />
                <title>
                    {pagename == "home"
                        ? Sitename
                        : Sitename + " | " + pagename}
                </title>
                <meta name="description" content={Me + "'s website."} />
            </Head>
            <div className="h-30 w-full py-10 ">
                <h1
                    className={[
                        "font-bold",
                        "text-4xl",
                        `hover:${color}`,
                        "inline-block",
                    ].join(" ")}
                >
                    <Link href={`/${Get_page_ids("home")}`}>
                        <a>{Sitename}</a>
                    </Link>
                </h1>
                <Menu pagename={pagename} />
            </div>
        </header>
    );
}
