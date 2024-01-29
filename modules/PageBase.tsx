import React from 'react';
import Head from 'next/head';

export type PageBaseProps = {
  children?: React.ReactNode;
  flex?: boolean;
};

const PageBase = (props: PageBaseProps) => {
  return (
    <div className="bg-black text-white flex flex-col flex-1">
      <Head>
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
      </Head>      <div
        className={[
          'container mx-auto mt-4 flex-1',
          props.flex ? 'flex flex-col' : '',
        ].join(' ')}
      >
        {props.children}
      </div>
      <div className="py-6 text-center">
        <a
          href="https://github.com/pinapelz/ragtag-player-remote"
          className="text-gray-500 hover:underline"
          target="_blank"
          rel="noreferrer noopener nofollow"
        >
          A goofy ahh fork of ragtag-player
        </a>
      </div>
    </div>
  );
};

export default PageBase;
