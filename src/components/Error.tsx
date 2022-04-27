import Head from 'next/head';

interface ErrorPageProps {
  code: number;
  message: string;
  title: string;
}

export default function ErrorPage({ code, message, title }: ErrorPageProps) {
  return (
    <div
      className="flex flex-col justify-center items-center text-center text-black bg-discord-dark"
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      <Head>
        <title>{title} | Pepe Manager</title>
      </Head>

      <div>
        <h1 className="inline-block py-2 pr-6 pl-0 my-0 mr-5 ml-0 text-2xl font-bold text-white align-top border-r border-white border-solid">
          {code}
        </h1>

        <div className="inline-block h-12 text-left align-middle" style={{ lineHeight: '49px' }}>
          <h2 className="p-0 m-0 text-sm text-white" style={{ fontWeight: 'normal', lineHeight: 'inherit' }}>
            {message}
          </h2>
        </div>
      </div>
    </div>
  );
}
