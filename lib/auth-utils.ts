import { headers } from "next/headers"
import { auth } from "./auth"
import { redirect } from "next/navigation"

export const authSession = async () => {
    try {
        const session = auth.api.getSession({ headers: await headers() })
        if (!session) {
            throw new Error("Unauthorized: No session found.")
        }
        return session
    } catch {
        throw new Error("Unauthorized: Failed to get session.")
    }
}

export const authIsRequired = async () => {
    const session = await authSession();

    if (!session) {
        redirect("/sign-in");
    }

    return session;
};

export const authIsNotRequired = async () => {
    const session = await authSession()
    if (session) {
        redirect("/")
    }
}