import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AuthProvider, { useAuth, UserAuthContext } from "../../context/AuthContext";

const mockCheckToken = vi.fn();
const mockLogout = vi.fn();

vi.mock("@apollo/client", async () => {
    const actual = await vi.importActual("@apollo/client");
    return {
        ...actual,
        useLazyQuery: vi.fn((query: any) => {
        if (query.definitions[0].name.value === "CheckToken") {
            return [mockCheckToken];
        }
        if (query.definitions[0].name.value === "Logout") {
            return [mockLogout];
        }
        return [vi.fn()];
        }),
    };
});

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
});

function TestComponent() {
    const { user, getInfos, logout, reset } = useAuth();
    return (
        <div>
            <button onClick={() => getInfos()}>Get Infos</button>
            <button onClick={() => logout()}>Logout</button>
            <button onClick={() => reset()}>Reset</button>
            <span data-testid="user">{user ? user.email : "null"}</span>
        </div>
    );
}

describe("AuthProvider", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("must set user to getInfos", async () => {
        const fakeUser: UserAuthContext = {
            email: "test@test.com",
            firstName: "Test",
            lastName: "User",
            id: "1",
        };
        mockCheckToken.mockImplementation(({ onCompleted }: any) => {
            onCompleted({ checkToken: fakeUser });
        });
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        screen.getByText("Get Infos").click();
        await waitFor(() => {
            expect(screen.getByTestId("user").textContent).toBe("test@test.com");
            expect(JSON.parse(localStorage.getItem("user")!)).toEqual(fakeUser);
        });
    });

    it("must reset the user", async () => {
        localStorage.setItem(
            "user",
            JSON.stringify({
                email: "test@test.com",
                firstName: "Test",
                lastName: "User",
                id: "1",
            })
        );
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        screen.getByText("Reset").click();
        await waitFor(() => {
            expect(screen.getByTestId("user").textContent).toBe("null");
        });
    });

    it("must provide a null user by default", () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        expect(screen.getByTestId("user").textContent).toBe("null");
    });
    
    it("must logout the user and clear local storage", async () => {
        localStorage.setItem(
            "user",
            JSON.stringify({
                email: "test@test.com",
                firstName: "Test",
                lastName: "User",
                id: "1",
            })
        );
        mockLogout.mockImplementation(({ onCompleted }: any) => {
            onCompleted({ logout: { success: true } });
        });
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        screen.getByText("Logout").click();
        await waitFor(() => {
            expect(screen.getByTestId("user").textContent).toBe("null");
            expect(localStorage.getItem("user")).toBeNull();
        });
    });
});
