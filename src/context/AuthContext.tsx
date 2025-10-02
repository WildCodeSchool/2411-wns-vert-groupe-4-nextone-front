import { CHECK_TOKEN, LOGOUT } from "../requests/queries/auth.query";
import { useLazyQuery } from "@apollo/client";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type CheckToken = {
  checkToken: {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    companyId: string;
    role: string;
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

  const [logout] = useLazyQuery(LOGOUT, {
    fetchPolicy: "no-cache",
  });

  const value: AuthContextType = {
    user,
    getInfos: async () => {
      await checkToken({
        onCompleted(data) {
          console.log(data);
          if (!data.checkToken) {
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
          };
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        },
      });
    },
    reset: () => setUser(null),
    logout: async () => {
      await logout({
        onCompleted(data) {
          if (data.logout.success) {
            setUser(null);
            localStorage.removeItem("user");
          }
        },
      });
    },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
