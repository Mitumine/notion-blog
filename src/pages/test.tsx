import type { NextPage } from "next";
import { Bookmark } from "../components/bookmark";

const URL_LIST = [
    "https://beta.reactjs.org/learn/state-as-a-snapshot",
    "https://amzn.to/37t3kjF",
    "https://通信エラーが起きてほしいな.com",
];

const Home: NextPage = () => {
    return (
        <div>
            {URL_LIST.map((url, i) => (
                <Bookmark url={url} key={i.toString()} />
            ))}
        </div>
    );
};

export default Home;
