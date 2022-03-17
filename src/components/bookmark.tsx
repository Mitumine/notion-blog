import { VFC } from "react";
import { OgpData, useOgp } from "../pages/api/getOgp";
import Skeleton from "react-loading-skeleton";
import React from "react";

const hoverclass = [
  "flex",
  "flex-col",
  "w-3/4",
  "bg-gray-100",
  "hover:bg-gray-300",
  "delay-100 ",
  "duration-200",
  "border",
  "rounded-lg",
  "border-gray-700",
  "p-5 ",
  "my-5",
  "break-words",
  "whitespace-pre-wrap",
  "truncate",
].join(" ");

const grayclass = ["text-xs", "text-gray-500", "break-words", "mt-3", "whitespace-pre-wrap", "truncate"].join(" ");

const titleclass = [
  "align-middle",
  "break-words",
  "flex",
  "text-gray-700",
  "font-semibold",
  // "whitespace-pre-wrap",
  "truncate",
].join(" ");

const faviconclass = ["h-5", "mr-3"].join(" ");

interface BookmarkViewProps {
  ogp: OgpData;
}

export const Bookmark = ({ url, caption }) => {
  const { data } = useOgp(url);

  switch (typeof data) {
    case "undefined":
      return <Loading />;
    default:
      if (caption != "") {
        data.title = caption;
      }
      return <BookmarkView ogp={data} />;
  }
};

const BookmarkView: VFC<BookmarkViewProps> = ({ ogp }) => {
  var { title, description, favicon_url, page_url, img_url } = ogp;
  if (title == "") {
    title = "無題のリンク";
  }

  const site_url = page_url.substring(0, page_url.indexOf("/", 8));

  const code = (
    <a href={page_url}>
      <div className={hoverclass}>
        <p className={titleclass}>
          <img className={faviconclass} src={favicon_url} />
          {title}
        </p>
        {description != "" ? <p className={grayclass}>{description}</p> : ""}
        <p className={grayclass}>{site_url}</p>
      </div>
    </a>
  );

  return code;
};

const Loading: VFC = () => {
  return (
    <div className={hoverclass}>
      <p className={titleclass}>
        <Skeleton className="w-full" />
      </p>
      <p className={grayclass}>
        <Skeleton className="w-full" />
      </p>
      <p className={grayclass}>
        <Skeleton className="w-full" />
      </p>
    </div>
  );
};
