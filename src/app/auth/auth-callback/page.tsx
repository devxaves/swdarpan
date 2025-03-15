import { db } from "@/lib/db";
import { currentUser } from "@/lib/mockClerk"; // Use the mock function
import { redirect } from "next/navigation";
import React from 'react'

const AuthCallbackPage = async () => {
    const user = await currentUser();

    if (!user?.id || !user.emailAddresses?.[0]?.emailAddress) {
        return redirect("/signin");
    }

    const dbUser = await db.user.findFirst({
        where: {
            clerkId: user.id,
        },
    });

    if (!dbUser) {
        await db.user.create({
            data: {
                id: user.id,
                clerkId: user.id,
                email: user.emailAddresses?.[0]?.emailAddress || "",
                firstName: user.firstName!,
                lastName: user.lastName || "",
                image: user.imageUrl,
            },
        });

        redirect("/onboarding");
    }

    redirect("/dashboard");
};

export default AuthCallbackPage;
