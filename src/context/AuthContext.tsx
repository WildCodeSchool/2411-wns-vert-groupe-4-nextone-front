import { LOGOUT } from "@/requests/mutations/auth.mutation";
import { CHECK_TOKEN } from "../requests/queries/auth.query";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type CheckToken = {
  checkToken: {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    companyId: string;
    role: string;
    profileImage?: string;
  };
};

export type UserAuthContext = CheckToken["checkToken"] | null;

type AuthContextType = {
  user: UserAuthContext;
  getInfos(): Promise<void>;
  logout(): Promise<void>;
  reset(): void;
};
const AuthContext = createContext({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

function AuthProvider({ children }: Readonly<PropsWithChildren>) {
  const [user, setUser] = useState<UserAuthContext>(() => {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return null;
  });
  const [checkToken] = useLazyQuery<CheckToken>(CHECK_TOKEN, {
    fetchPolicy: "no-cache",
  });

  const [logout, { client }] = useMutation(LOGOUT, {
    fetchPolicy: "no-cache",
  });

  const handleLogout = async () => {
    await logout({
      onCompleted(data) {
        if (data.logout.success) {
          setUser(null);
          localStorage.removeItem("user");
          client.clearStore();
        }
      },
    });
  };

  const checkAuth = async () => {
    try {
      const { data } = await checkToken();
      if (!data?.checkToken) {
        setUser(null);
        localStorage.removeItem("user");
        return;
      }

      const user = {
        email: data.checkToken.email ?? "",
        firstName: data.checkToken.firstName ?? "",
        id: data.checkToken.id ?? "",
        lastName: data.checkToken.lastName ?? "",
        companyId: data.checkToken.companyId ?? "",
        role: data.checkToken.role ?? "",
        profileImage: data.checkToken.profileImage ?? "",
      };

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
  }, []);

  const value: AuthContextType = {
    user,
    getInfos: async () => {
      await checkAuth();
    },
    reset: () => {
      setUser(null);
      localStorage.removeItem("user");
    },
    logout: handleLogout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
