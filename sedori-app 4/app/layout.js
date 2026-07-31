import "./globals.css";

export const metadata = {
  title: "せどり収支管理",
  description: "せどりの仕入れ・売上・利益を管理するアプリ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
