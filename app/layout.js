import "bootstrap/dist/css/bootstrap.min.css";
import "./components.css";
import Header from "@/app/components/globals/Header";

export const metadata = {
  title: "COMELEC - Commission on Elections - eSOCE Portal",
  description: "COMELEC - Commission on Elections - eSOCE Portal",
};

export default function RootLayout({children}) {
  return (
      <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description}/>
        <link rel="icon" href="/comelecfav162.png"/>
        <link rel="apple-touch-icon" href="/comelecfav162.png"/>
        <link rel="manifest" href="/manifest.json"/>
      </head>

      <body>
      <Header></Header>
      {children}
      </body>
      </html>
  );
}
