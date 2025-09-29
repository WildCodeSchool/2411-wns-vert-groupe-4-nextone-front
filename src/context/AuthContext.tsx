import { CHECK_TOKEN } from "@/requests/queries/auth.query";
import { useLazyQuery } from "@apollo/client";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type CheckToken = {
  checkToken: {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
  };
};

type UserAuthContext = CheckToken["checkToken"] | null;

type ContextType = {
  user: UserAuthContext;
  getInfos(): Promise<void>;
  reset(): void;
};
const AuthContext = createContext({} as ContextType);

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

  const value: ContextType = {
    user,
    getInfos: async () => {
      await checkToken({
        onCompleted(data) {
          console.log("%c⧭", "color: #00aaff", data);
          const user = {
            email: data.checkToken.email ?? "",
            firstName: data.checkToken.firstName ?? "",
            id: data.checkToken.id ?? "",
            lastName: data.checkToken.lastName ?? "",
          };
          console.log("%c⧭", "color: #f200e2", user);
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        },
      });
    },
    reset: () => setUser(null),
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
