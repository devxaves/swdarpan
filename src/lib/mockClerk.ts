// src/lib/mockClerk.ts
export const currentUser = () => {
    return Promise.resolve({
        id: "user_123",
        firstName: "Mock",
        lastName: "User",
        imageUrl: "https://example.com/avatar.png",
        emailAddresses: [
            {
                emailAddress: "mock@example.com",
            },
        ],
    });
};