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
      {/* <div className="mt-6 text-gray-500 text-center">
        Made with 🍝 by{' '}
        <a
          href="https://twitter.com/kitsune_cw"
          className="hover:underline"
          target="_blank"
          rel="noreferrer noopener nofollow"
        >
          kitsune
        </a>
        .
      </div>
      <div className="mb-6 text-center">
        <a
          href="https://gitlab.com/aonahara/archive-browser"
          className="text-gray-500 hover:underline"
          target="_blank"
          rel="noreferrer noopener nofollow"
        >
          Source code
        </a>
      </div> */}
    </div>
  );
};

export default PageBase;
