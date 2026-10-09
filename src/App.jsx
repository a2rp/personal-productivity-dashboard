import { useEffect, useState } from "react";
import PersonalProductivityDashboard from "./components/personalProductivityDashboard/index.jsx";
import BackToTop from "./components/backToTop/index.jsx";
import SiteFooter from "./components/siteFooter/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import styles from "./App.module.css";
const App = () => {
 const [showBackToTop, setShowBackToTop] = useState(false);
 useEffect(() => { const update = () => setShowBackToTop(window.scrollY > 50); window.addEventListener("scroll", update, { passive: true }); update(); return () => window.removeEventListener("scroll", update); }, []);
 return <div className={styles.appShell} id="top"><SiteHeader title="Daily Overview" mark="O" repoUrl="https://github.com/a2rp/personal-productivity-dashboard" navItems={[["Today","#today"],["Insights","#insights"]]} /><main className={styles.pageContent}><PersonalProductivityDashboard /></main><SiteFooter repoUrl="https://github.com/a2rp/personal-productivity-dashboard" /><BackToTop visible={showBackToTop} /></div>;
};
export default App;