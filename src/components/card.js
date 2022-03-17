import Link from "next/link";
import { Tag_color } from "./colors";
import React from "react";

export default function Card(post) {
  const ppnt = post.properties.Name.title;
  const pagename = ppnt[0] ? ppnt[0].plain_text : "無題のページ";

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

  const cover_img = get_cover(post);
  const icon_img = get_icon(post);

  const code = (
    <Link key={post.id} href={`/${post.id}`}>
      <a>
        <div className="hover:bg-gradient-to-bl	from-lime-300 to-yellow-300 delay-100 duration-100 p-6 rounded-lg w-full h-full cursor-pointer">
          <img src={icon_img} className="bg-gray-200/60 w-full rounded " />
          <div className="mt-3">{tags}</div>
          <div className="text-gray-900 font-bold mt-2 text-m">{pagename}</div>
        </div>
      </a>
    </Link>
  );

  return code;
}

function get_cover(post) {
  const pc = post.cover;

  if (pc != null) {
    switch (pc.type) {
      case "file":
        return pc.file.url;
      case "external":
        return pc.external.url;
    }
  } else {
    return "https://picsum.photos/250/250";
  }
}

function get_icon(post) {
  const pi = post.icon;

  if (pi != null) {
    switch (pi.type) {
      case "file":
        return pi.file.url;
      case "external":
        return pi.external.url;
    }
  } else {
    return "https://picsum.photos/250/250";
  }
}
