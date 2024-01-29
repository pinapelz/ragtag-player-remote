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
  const [urlInfoJson, setUrlInfoJson] = React.useState("");
  const [infoJson, setInfoJson] = React.useState({} as any);
  const [showPlayer, setShowPlayer] = React.useState(false);
  const { query } = router;

  const videoUrl = query.vid as string;
  const chatUrl = query.chat as string;
  const infoJsonUrl = query.info as string;
  const srv3Url = query.ytt as string;

  if (videoUrl && videoUrl !== urlVideo) {
    setUrlVideo(videoUrl);
  }
  if (chatUrl && chatUrl !== urlChat) {
    setUrlChat(chatUrl);
  }

  if (srv3Url && srv3Url !== urlYtt) {
    setUrlYtt(srv3Url);
  }

  if (infoJsonUrl && infoJsonUrl !== urlInfoJson) {
    setUrlInfoJson(infoJsonUrl);
  }

  if (videoUrl && !showPlayer) {
    setShowPlayer(true);
  }

  useEffect(() => {
    if (urlInfoJson) {
      fetch(urlInfoJson)
        .then((res) => res.json())
        .then((data) => {
          setInfoJson(data);
        });
    }
  }),
    [urlChat];

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (newValue: string) => any
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.error("No file selected");
      return false;
    }
    const url = URL.createObjectURL(file).toString();
    console.log(url);
    setter(url);
  };

  return (
    <PageBase>
      <Head>
        <title>Custom Player - Ragtag Archive</title>
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
          {!videoUrl ? (
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
            <h1 className="text-3xl mt-16 text-center">Custom Video Player</h1>
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
                <span>Select captions (srv3)</span>
                <span className="ml-auto">
                  {urlYtt ? <IconCheck width="1em" height="1em" /> : null}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFile(e, setUrlYtt)}
                />
              </label>
              <label
                className={[buttonStyle, "relative cursor-pointer"].join(" ")}
              >
                <span>Select .info.json</span>
                <span className="ml-auto">
                  {urlYtt ? <IconCheck width="1em" height="1em" /> : null}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFile(e, setUrlInfoJson)}
                />
              </label>

              <button
                type="button"
                className={[buttonStyle, "mt-8 ml-auto"].join(" ")}
                onClick={() => setShowPlayer(true)}
              >
                Launch player
              </button>
            </form>
          </div>
        </div>
      )}
    </PageBase>
  );
};

export default CustomPlayerPage;
