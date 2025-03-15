import React from "react";
import { DashboardNavbar, Sidebar } from "@/components";
import { currentUser } from "@/lib/mockClerk"; // Use the mock function
import { redirect } from "next/navigation";

interface Props {
    children: React.ReactNode;
}

const DashboardLayout = async ({ children }: Props) => {
    // Get the mock user
    const user = await currentUser();

    // If the user is not available, redirect to the sign-in page
    if (!user) {
        redirect("/auth/signin");
    }

    // Mock database user data
    const dbUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        stripeCustomerId: "cus_123456789", // Mock stripeCustomerId
        symptoms: [
            { id: "1", name: "Headache" },
            { id: "2", name: "Fever" },
        ], // Mock symptoms data
        medications: [
            { id: "1", name: "Paracetamol" },
            { id: "2", name: "Ibuprofen" },
        ], // Mock medications data
        mentalwellness: [
            { id: "1", name: "Anxiety" },
            { id: "2", name: "Stress" },
        ], // Mock mental wellness data
    };

    // If the mock user is not available, redirect to onboarding
    if (!dbUser) {
        redirect("/onboarding?step=1");
    }

    // Check if the user is a pro user (mock logic)
    const isPro = dbUser?.stripeCustomerId ? true : false;

    return (
        <main className="mx-auto w-full min-h-screen relative">
            <DashboardNavbar isPro={isPro} />
            <Sidebar />
            <div className="sm:pl-20 lg:pl-16 flex flex-col w-full px-2 py-4 lg:p-4">
                {children}
            </div>
        </main>
    );
};

export default DashboardLayout;