import styles from "./page.module.css";
import OrangeHero from "@/(frontend)/OrangeHero/OrangeHero";
import SocialProof from "@/(frontend)/SocialProof/SocialProof";
import Marquee from "@/(frontend)/Markee/Markee";
import Work from "@/(frontend)/work/work";
import Feature from "@/(frontend)/Feature/Feature";
import Pricing from "@/(frontend)/pricing/pricing";
import CtaBlock from "@/(frontend)/CtaBlock/CtaBlock";

export default function Home() {
  return (
    <main className={styles.mainWrapper}>
      <OrangeHero />
      <SocialProof />
      <Marquee />
      <Work />
      <Feature />
      <Pricing />
      <CtaBlock />
    </main>
  );
}
