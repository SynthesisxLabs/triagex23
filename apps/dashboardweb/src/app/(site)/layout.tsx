import Navbar from "@/(frontend)/Navbar/Navbar";
import Footer from "@/(frontend)/Footer/Footer";
import SmoothScroll from "@/(frontend)/SmoothScroll";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <Navbar />
      {children}
      <Footer />
    </SmoothScroll>
  );
}
