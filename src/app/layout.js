import "./globals.css";

export const metadata = {
  title: "Portfolio | Full-Stack Developer",
  description: "A passionate full-stack developer specializing in building exceptional digital experiences. Explore my projects, experience, and skills.",
  keywords: ["portfolio", "developer", "full-stack", "web development", "react", "next.js"],
  openGraph: {
    title: "Portfolio | Full-Stack Developer",
    description: "A passionate full-stack developer specializing in building exceptional digital experiences.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-grid" />
        <div className="bg-glow bg-glow-1" />
        <div className="bg-glow bg-glow-2" />
        {children}
      </body>
    </html>
  );
}
