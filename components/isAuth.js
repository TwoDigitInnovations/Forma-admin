import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const isAuth = (Component, allowedRoles = []) => {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(null);

    const publicRoutes = ["/login"];
    const path = router.pathname.toLowerCase();
    const isPublic = publicRoutes.includes(path);

    useEffect(() => {
      if (typeof window === "undefined") return;

      if (isPublic) {
        setIsAuthorized(true);
        return;
      }

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userDetail");

      if (!token || !userData) {
        router.replace("/login");
        return;
      }

      try {
        const user = JSON.parse(userData);

        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          router.replace("/");
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        router.replace("/login");
      }
    }, [path]);

    if (!isPublic && isAuthorized === null) return null;

    return <Component {...props} />;
  };
};

export default isAuth;
