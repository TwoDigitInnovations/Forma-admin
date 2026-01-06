import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SidePannel from "./SidePannel";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const router = useRouter();
  const [openTab, setOpenTab] = useState(false);
  const [token, setToken] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  if (!mounted) return null; 

  const path = router.pathname;

  const isLoginPage = path === "/login";


  if (isLoginPage) {
    return (
      <main className="min-h-screen bg-white">
        {children}
      </main>
    );
  }

 
  return (
    <div className="min-h-screen bg-white flex">
      <SidePannel setOpenTab={setOpenTab} openTab={openTab} />

      <div className="flex-1 xl:pl-70 md:pl-62.5 sm:pl-50">
        <Navbar setOpenTab={setOpenTab} openTab={openTab} />
        <main className="">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
