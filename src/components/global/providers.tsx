"use client";

import React from "react";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
    children: React.ReactNode;
}

const client = new QueryClient();

// Mock user object
const mockUser = {
    id: "user_123",
    firstName: "Mock",
    lastName: "User",
    imageUrl: "https://example.com/avatar.png",
    emailAddresses: [
        {
            emailAddress: "mock@example.com",
        },
    ],
};

// Mock Clerk Provider
function MockClerkProvider({ children }: { children: React.ReactNode }) {
    const { isLoaded, isSignedIn, user } = useUser();

    // If Clerk is not loaded, show a loading state (optional)
    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    // If the user is not signed in, mock the session
    if (!isSignedIn) {
        return (
            <div>
                {children}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.Clerk = {
                                user: ${JSON.stringify(mockUser)},
                                session: { id: "session_123" },
                                loaded: true,
                            };
                        `,
                    }}
                />
            </div>
        );
    }

    // If the user is signed in, render the children
    return <>{children}</>;
}

const Providers = ({ children }: Props) => {
    return (
        <QueryClientProvider client={client}>
            <ClerkProvider>
                <MockClerkProvider>{children}</MockClerkProvider>
            </ClerkProvider>
        </QueryClientProvider>
    );
};

export default Providers;