import { JSDOM } from "jsdom";
import type { NextApiRequest, NextApiResponse } from "next";
import useSWR from "swr";
import axios from "axios";

export function useOgp(url: string) {
  const fetcher = (path: string) => fetch(path).then((res) => res.json());
  const response = useSWR<OgpData>(`/api/getOgp?url=${url}`, fetcher);
  const { data, error } = response;
  return { data, error };
}

export type OgpData = {
  title: string; // ページタイトル
  page_url: string; // ページのURLそのもの
  description: string; // ページの説明
  favicon_url: string; // ファビコンのURL
  img_url: string; // OGP画像のURL
};

async function getOgp(req: NextApiRequest, res: NextApiResponse<OgpData>) {
  // クエリパラメタからURL情報を受け取り、エンコードする
  const { url } = req.query;
  const encodeURL = encodeURI(url as string);

  if (!url) {
    res.status(400).json({
      title: "Sorry!",
      description: "",
      favicon_url: "",
      img_url: "",
      page_url: "",
    });
  }

  const axios_respose = axios({ method: "GET", url: encodeURL, responseType: "document" })
    .then((response) => {
      const jsdom = new JSDOM();
      const dom = new jsdom.window.DOMParser();
      const el = dom.parseFromString(response.data, "text/html");
      const headEls = el.head.children;
      const headEls_list = Array.from(headEls);
      const contents = headEls_list.map((v: Element) => {
        const prop = v.getAttribute("property");
        if (!prop) return;
        return {
          prop: prop.replace("og:", ""),
          content: v.getAttribute("content"),
        };
      });
      return contents;
    })
    .then((list) => {
      return list.filter((v) => v);
    })
    .then((result) => {
      //  Get favicon
      const site_url = encodeURL.substring(0, encodeURL.indexOf("/", 8)) as string;
      const favicon_src = `https://www.google.com/s2/favicons?domain=${site_url}`;

      const ogpData: OgpData = {
        title: result_filter(result, "title"),
        description: result_filter(result, "description"),
        favicon_url: favicon_src,
        img_url: result_filter(result, "image"),
        page_url: url as string,
      };

      return ogpData;
    })
    .catch((error) => {
      console.error("!-----");
      console.error(error);
      console.error("!-----");
      const ogpData: OgpData = {
        title: "Sorry!",
        description: "",
        favicon_url: "",
        img_url: "",
        page_url: "",
      };
      return ogpData;
    });
  res.status(200).json(await axios_respose);
}

function result_filter(result, value: string) {
  const f = result.filter((v: { prop: string }) => v.prop === value);
  switch (f.length) {
    case 0:
      return "";
    default:
      return f[0].content;
  }
}

export default getOgp;
