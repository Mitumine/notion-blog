import { VFC } from "react";
import { OgpData, useOgp } from "../pages/api/getOgp";
import Skeleton from "react-loading-skeleton";

interface BookmarkViewProps {
    ogp: OgpData;
}

export const Bookmark = ({ url }) => {
    const { data } = useOgp(url);

    switch (typeof data) {
        case "undefined":
            return <Loading />;
        default:
            return <BookmarkView ogp={data} />;
    }
};

const BookmarkView: VFC<BookmarkViewProps> = ({ ogp }) => {
    const { title, description, favicon_url, page_url, img_url } = ogp;
    const site_url = page_url.substring(0, page_url.indexOf("/", 8));
    const code = (
        <div className="flex w-3/4 bg-gray-200 border rounded-lg border-gray-700 p-5 my-5">
            <a
                href={page_url}
                className=" hover:bg-gray-300 delay-100 duration-200"
            >
                <p className="text-gray-700 font-semibold">{title}</p>
                <p className="text-xs text-gray-500 mt-3">{description}</p>
                <p className="text-xs text-gray-500 mt-3">{site_url}</p>
            </a>
        </div>
    );

    return code;
};

const Loading: VFC = () => {
    return (
        <div className="flex w-3/4 bg-rose-200 border rounded-lg border-gray-700 p-5 ">
            <a href="" className=" hover:bg-gray-300 delay-100 duration-200">
                <p className="text-gray-700 font-semibold">
                    <Skeleton className="w-full" />
                </p>
                <p className="text-xs text-gray-500 mt-3">
                    <Skeleton className="w-full" />
                </p>
                <p className="text-xs text-gray-500 mt-3">
                    <Skeleton className="w-full" />
                </p>
            </a>
        </div>
    );
};
