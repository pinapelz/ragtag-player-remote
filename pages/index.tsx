import React, { useEffect } from "react";
import Head from "next/head";
import ChatReplayPanel from "../modules/ChatReplay/ChatReplayPanel";
import { useWindowSize } from "../modules/hooks/useWindowSize";
import PageBase from "../modules/PageBase";
import VideoPlayer2 from "../modules/VideoPlayer/VideoPlayer2";
import { buttonStyle } from "../modules/VideoActionButtons";
import { IconCheck } from "../modules/icons";
import { useRouter } from "next/router";
import Linkify from "linkify-react";

const CustomPlayerPage = () => {
  const router = useRouter();
  const [isChatVisible, setIsChatVisible] = React.useState(false);
  const { innerWidth, innerHeight } = useWindowSize();
  const [playbackProgress, setPlaybackProgress] = React.useState(0);
  const [urlVideo, setUrlVideo] = React.useState("");
  const [urlChat, setUrlChat] = React.useState("");
  const [urlYtt, setUrlYtt] = React.useState("");
  const [captionFormat, setCaptionFormat] = React.useState<"srv3" | "srt" | undefined>(undefined);
  const [infoJson, setInfoJson] = React.useState({} as any);
  const [showPlayer, setShowPlayer] = React.useState(false);
  const [dataSet, setDataSet] = React.useState(false);
  const [base64Input, setBase64Input] = React.useState("");
  const { query } = router;

  const jsonDataUrl = query.data as string;
  const timeSeconds = query.time as string;

  useEffect(() => {
    if (timeSeconds) {
      setPlaybackProgress(parseFloat(timeSeconds));
    }
  }, [timeSeconds]);


  const applyJsonData = (data: any) => {
    const { info, video, chat, srv3, srt, captions } = data;
    if (info) {
      fetch(info)
        .then((res) => res.json())
        .then((data) => {
          setInfoJson(data);
        });
    }
    if (video) {
      setUrlVideo(video);
    }
    if (chat) {
      setUrlChat(chat);
    }
    if (srv3) {
      setUrlYtt(srv3);
      setCaptionFormat("srv3");
    } else if (srt) {
      setUrlYtt(srt);
      setCaptionFormat("srt");
    } else if (captions) {
      const cap = Array.isArray(captions) ? captions[0] : captions;
      if (cap?.src) {
        setUrlYtt(cap.src);
        setCaptionFormat(cap.format || (cap.src.toLowerCase().endsWith(".srt") ? "srt" : "srv3"));
      }
    }
    setDataSet(true);
    setShowPlayer(true);
  };

  if (jsonDataUrl && !dataSet) {
    fetch(jsonDataUrl)
      .then((res) => res.json())
      .then((data) => applyJsonData(data))
      .catch((error) => {
        console.error("Error fetching JSON data:", error);
        setDataSet(true);
        setShowPlayer(true);
      });
  }

  const handleLoadBase64 = () => {
    try {
      let trimmed = base64Input.trim();
      const base64Match = trimmed.match(/^data:[^;]+;base64,(.*)$/);
      if (base64Match) {
        trimmed = base64Match[1];
      }
      const jsonStr = atob(trimmed);
      const data = JSON.parse(jsonStr);
      applyJsonData(data);
    } catch (error) {
      console.error("Error decoding base64 JSON:", error);
      setDataSet(true);
      setShowPlayer(true);
    }
  };


  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (newValue: string) => any,
    opts?: { onFormat?: (format: "srv3" | "srt") => void }
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.error("No file selected");
      return false;
    }
    const url = URL.createObjectURL(file).toString();
    console.log(url);
    if (opts?.onFormat) {
      const name = file.name.toLowerCase();
      opts.onFormat(name.endsWith(".srt") ? "srt" : "srv3");
    }
    setter(url);
  };

  return (
    <PageBase>
      <Head>
        {
          infoJson && infoJson.title ? (
            <title>{infoJson.title}</title>
          ) :
          <title>a very nice video</title>
        }

      </Head>
      {showPlayer ? (
        <div className="mt-2">
          <div
            className={["flex lg:flex-row flex-col lg:h-auto"].join(" ")}
            style={{
              height: isChatVisible && innerWidth < 640 ? innerHeight : "auto",
            }}
          >
            <div className="w-full lg:w-3/4">
              <div
                className="relative bg-gray-400 w-full h-0"
                style={{ paddingBottom: "56.25%" }}
              >
                <div className="absolute inset-0 w-full h-full">
                  <VideoPlayer2
                    key={urlVideo}
                    videoId="custom"
                    srcVideo={urlVideo}
                    srcAudio={urlVideo}
                    captions={
                      urlYtt
                        ? [
                            {
                              lang: "en",
                              src: urlYtt,
                              format: captionFormat,
                            },
                          ]
                        : undefined
                    }
                    onPlaybackProgress={setPlaybackProgress}
                  />
                </div>
              </div>
            </div>
            <div
              className={[
                "w-full lg:w-1/4 lg:pl-4",
                isChatVisible ? "flex-1" : "",
              ].join(" ")}
            >
              {!urlChat ? (
                <div className="border border-gray-800 rounded p-4 text-center">
                  <p>Chat replay unavailable</p>
                </div>
              ) : (
                <ChatReplayPanel
                  src={urlChat}
                  currentTimeSeconds={playbackProgress}
                  onChatToggle={setIsChatVisible}
                />
              )}
            </div>
          </div>
          {infoJson && infoJson.description ? (
            <div className="mt-4 mx-6">
              <h1 className="text-2xl mb-2">{infoJson.title}</h1>
              <p className="text-gray-400">
                {infoJson.view_count.toLocaleString()} views &middot;{" "}
                {infoJson.upload_date.slice(0, 4) +
                  "-" +
                  infoJson.upload_date.slice(4, 6) +
                  "-" +
                  infoJson.upload_date.slice(6, 8)}
              </p>
              <div className="mt-4 pb-4 border-b border-gray-900">
                <p className="font-bold text-lg leading-tight mb-4">
                  {infoJson.uploader}
                </p>
                <h3 className="font-bold mb-2">Description</h3>
                <div className="whitespace-pre-line break-words text-gray-300">
                  <Linkify>{infoJson.description}</Linkify>
                </div>
              </div>
            </div>
          ) : null}
          {urlVideo ? (
            <button
              type="button"
              className={[buttonStyle, "mt-4"].join(" ")}
              onClick={() => setShowPlayer(false)}
            >
              Go back
            </button>
          ) : null}
        </div>
      ) : (
        <div>
          <div className="px-4 pb-8">
            <h1 className="text-3xl mt-16 text-center">Moekyun Video Player</h1>
            <p className="text-lg text-center">
              You can play locally-saved video files and chat replay JSON
            </p>
            <p className="text-center">
              Chat replay compatible with output from{" "}
              <a
                className="underline"
                href="https://github.com/yt-dlp/yt-dlp"
                target="_blank"
                rel="noreferrer noopener nofollow"
              >
                yt-dlp
              </a>
              {" and "}
              <a
                className="underline"
                href="https://pypi.org/project/chat-downloader/"
                target="_blank"
                rel="noreferrer noopener nofollow"
              >
                chat-downloader
              </a>
              .
            </p>
            <br/>
            <p className="text-center">
              This is a specialized version of the player that allows you to pass in a JSON data file.
            </p>
          </div>
          <div className="mx-auto max-w-md">
            <form>
              <label
                className={[buttonStyle, "relative cursor-pointer"].join(" ")}
              >
                <span>Select video</span>
                <span className="ml-auto">
                  {urlVideo ? <IconCheck width="1em" height="1em" /> : null}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFile(e, setUrlVideo)}
                />
              </label>
              <label
                className={[buttonStyle, "relative cursor-pointer"].join(" ")}
              >
                <span>Select chat json</span>
                <span className="ml-auto">
                  {urlChat ? <IconCheck width="1em" height="1em" /> : null}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFile(e, setUrlChat)}
                />
              </label>
              <label
                className={[buttonStyle, "relative cursor-pointer"].join(" ")}
              >
                <span>Select captions (srv3 or srt)</span>
                <span className="ml-auto">
                  {urlYtt ? <IconCheck width="1em" height="1em" /> : null}
                </span>
                <input
                  type="file"
                  accept=".srv3,.xml,.srt"
                  className="hidden"
                  onChange={(e) =>
                    handleFile(e, setUrlYtt, {
                      onFormat: (fmt) => setCaptionFormat(fmt),
                    })
                  }
                />
              </label>

              <button
                type="button"
                className={[buttonStyle, "mt-8 ml-auto"].join(" ")}
                onClick={() => {
                  setShowPlayer(true);
                  setDataSet(false);
                }}
              >
                Launch player
              </button>
            </form>
            <div className="mt-6">
              <label className="block text-sm text-gray-300 mb-2">
                Or paste base64-encoded JSON data
              </label>
              <textarea
                className="w-full h-32 p-2 rounded bg-gray-800 text-gray-100 border border-gray-700 text-sm font-mono"
                placeholder="Paste base64 JSON here..."
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
              />
              <button
                type="button"
                className={[buttonStyle, "mt-2 ml-auto"].join(" ")}
                onClick={handleLoadBase64}
              >
                Load from base64
              </button>
            </div>
            <div className="mt-6 mx-auto max-w-2xl text-sm text-gray-400 text-left border border-gray-800 rounded p-4">
              <p className="font-bold text-gray-200 mb-2">JSON data format</p>
              <p className="mb-2">
                Pass a URL via the <code>?data=</code> query parameter pointing to a JSON file.
                All fields are optional. Recognized top-level keys:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><code>info</code> - URL to a YouTube <code>info.json</code> (yt-dlp metadata)</li>
                <li><code>video</code> - URL to the video file/stream</li>
                <li><code>chat</code> - URL to a chat replay JSON</li>
                <li><code>srv3</code> - URL to a YouTube srv3 caption XML file</li>
                <li><code>srt</code> - URL to a SubRip (<code>.srt</code>) subtitle file</li>
                <li><code>captions</code> - a single object <code>{`{ src, format }`}</code> or an array of them, where <code>format</code> is <code>"srv3"</code> or <code>"srt"</code></li>
              </ul>
              <p className="mt-2">
                Example: <code>{`?data=https://example.com/session.json`}</code>
              </p>
              <p className="mt-4 mb-1">
                Alternatively, paste the JSON content as base64 directly into the textarea above
                (a leading <code>data:...;base64,</code> prefix is optional).
              </p>
            </div>
          </div>
        </div>
      )}
    </PageBase>
  );
};

export default CustomPlayerPage;
