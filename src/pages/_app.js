import Layout from "../../components/layouts";
import Loader from "../../components/loader";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Api } from "@/services/service";

export const userContext = createContext();
export const ProjectDetailsContext = createContext();

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState({});
  const [projectDetails, setProjectdetails] = useState({});
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const publicRoutes = ["/login"];

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    const path = router.pathname.toLowerCase();
    const isPublic = publicRoutes.includes(path);

    const token = localStorage.getItem("token");
    const localUser = localStorage.getItem("userDetail");

    if (!token && !isPublic) {
      router.push("/login");
      return;
    }

    if (localUser) {
      setUser(JSON.parse(localUser));
    }

    if (token) {
      try {
        const res = await Api("get", "auth/profile", "", router);
        localStorage.setItem("userDetail", JSON.stringify(res.data));
        setUser(res.data);
      } catch {
        // localStorage.clear();
        // setUser({})
        // router.push("/login");
      }
    }
  };

  return (
    <userContext.Provider value={[user, setUser]}>
      <ProjectDetailsContext.Provider
        value={[projectDetails, setProjectdetails]}
      >
        <Loader open={open} />
        <ToastContainer position="top-right" autoClose={3000} />

        <Layout loader={setOpen}>
          {user !== null && (
            <Component {...pageProps} loader={setOpen} user={user} />
          )}
        </Layout>
      </ProjectDetailsContext.Provider>
    </userContext.Provider>
  );
}
