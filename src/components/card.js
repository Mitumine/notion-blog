import Link from "next/link";
import { Tag_color } from "./colors";

export default function Card(post) {
    const pagename = post.properties.Name.title[0].plain_text;

    const tags = post.properties.Tags.multi_select.map((tag) => (
        <div
            key={tag.key}
            className={`rounded-lg ${Tag_color(
                tag.color
            )} px-2 py-1 text-white font-light inline-block w-auto mr-1 mt-1 text-xs`}
        >
            {tag.name}
        </div>
    ));

    const code = (
        <Link key={post.id} href={`/${post.id}`}>
            <div className="hover:bg-gray-200 delay-50 duration-100 p-6 rounded-lg w-full h-full cursor-pointer">
                <img
                    src="https://picsum.photos/250/250"
                    className="w-full rounded shadow"
                />
                <div className="text-gray-900 font-bold mt-5 text-m">
                    {pagename}
                </div>
                <div className="mt-2">{tags}</div>
            </div>
        </Link>
    );

    return code;
}
