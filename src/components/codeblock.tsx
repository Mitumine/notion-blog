import SyntaxHighlighter from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/cjs/styles/hljs";

const gray = "gray-700";

export const Code = ({ block }) => {
    const lang = block.code.language;
    const langclass = [
        "inline-block",
        "px-4",
        "py-2",
        "text-center",
        "border-l",
        "border-r",
        "border-t",
        `border-${gray}`,
        "border-b-transparent",
        "rounded-t-lg",
    ].join(" ");

    const capt = block.code.caption[0] ? block.code.caption[0].plain_text : "";

    const code_text = block.code.rich_text[0].plain_text;
    const codeclass = [
        "w-3/4",
        "border",
        "border",
        "border",
        "rounded-b-lg",
        "rounded-tr-lg",
        "p-5",
        `border-${gray}`,
        "mb-5",
    ].join(" ");

    return (
        <>
            <div className={langclass}>{lang}</div>
            <div className={codeclass}>
                <SyntaxHighlighter language={lang} style={githubGist}>
                    {code_text}
                </SyntaxHighlighter>
            </div>
        </>
    );
};
