import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

const AuthContext = createContext();
const init = {
  user: null,
  isAuthenticated: false,
};
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://img.xjh.me/random_img.php?type=bg&ctype=nature&return=302",
};
function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.playload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("没有合适的action");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(reducer, init);

  const login = useCallback((email, password) => {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", playload: FAKE_USER });
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "logout" });
  }, []);
  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
    }),
    [user, isAuthenticated, login, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("AuthContext was used outside AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
