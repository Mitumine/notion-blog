import { JSDOM } from "jsdom";
import type { NextApiRequest, NextApiResponse } from "next";

import useSWR from "swr";

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

    // エンコード済みURLに対してリクエストを行い、レスポンスからopgDataを抽出する
    try {
        fetch(encodeURL)
            .then((res) => res.text())
            .then((text) => {
                const jsdom = new JSDOM();
                const dom = new jsdom.window.DOMParser();
                const el = dom.parseFromString(text, "text/html");
                const headEls = el.head.children;
                return Array.from(headEls).map((v: Element) => {
                    const prop = v.getAttribute("property");
                    if (!prop) return;
                    return {
                        prop: prop.replace("og:", ""),
                        content: v.getAttribute("content"),
                    };
                });
            })
            .then((list) => {
                return list.filter((v) => v);
            })
            .then((result) => {
                //  Get favicon
                const favicon_path = "/favicon.ico";
                const site_url = encodeURL.substring(
                    0,
                    encodeURL.indexOf("/", 8)
                ) as string;

                const ogpData: OgpData = {
                    title: result_filter(result, "title"),
                    description: result_filter(result, "description"),
                    favicon_url: site_url + favicon_path,
                    img_url: result_filter(result, "image"),
                    page_url: url as string,
                };

                res.status(200).json(ogpData);
                return ogpData;
            });
    } catch (error) {
        // エラーが起きた際にもOgpDate型の情報が返ってくるようにする
        res.status(200).json({
            title: "Sorry!",
            description: "",
            favicon_url: "",
            img_url: "",
            page_url: url as string,
        });

        // デバッグ用
        console.log("!");
        console.log({ error });
    }
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
