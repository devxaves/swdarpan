"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import Link from "next/link";

const SignInPage = () => {
    const router = useRouter();
    const { isLoaded, signIn, setActive } = useSignIn();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isLoaded) {
            toast.error("Authentication system is not loaded yet.");
        }
    }, [isLoaded]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoaded) return;

        if (!email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        setIsLoading(true);

        try {
            const signInAttempt = await signIn.create({ identifier: email, password });

            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId });
                toast.success("Sign-in successful! Redirecting...");
                
                // Use both router.replace and window.location.href as a fallback
                router.replace("/dashboard");
                window.location.href = "/dashboard"; // Ensure the page reloads
            } else {
                toast.error("Invalid email or password.");
            }
        } catch (error: any) {
            console.error("Sign-in error:", error);
            switch (error.errors?.[0]?.code) {
                case "form_identifier_not_found":
                    toast.error("This email is not registered. Please sign up first.");
                    break;
                case "form_password_incorrect":
                    toast.error("Incorrect password. Please try again.");
                    break;
                case "too_many_attempts":
                    toast.error("Too many attempts. Try again later.");
                    break;
                default:
                    toast.error("An error occurred. Please try again.");
                    break;
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
            <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white border-opacity-20 p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-white">Sign In</h1>
                    <p className="text-white text-opacity-80">Welcome back! Sign in to your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white text-opacity-90 text-lg font-semibold">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            disabled={isLoading}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white bg-opacity-20 border-2 border-white border-opacity-30 text-white placeholder-white placeholder-opacity-50 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white text-opacity-90 text-lg font-semibold">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                disabled={isLoading}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white bg-opacity-20 border-2 border-white border-opacity-30 text-white placeholder-white placeholder-opacity-50 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-transparent transition-all duration-300 pr-12"
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                disabled={isLoading}
                                className="absolute top-1/2 right-2 transform -translate-y-1/2 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-300"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOffIcon className="w-5 h-5 text-white" /> : <EyeIcon className="w-5 h-5 text-white" />}
                            </Button>
                        </div>
                    </div>

                    {/* Sign In Button */}
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                        {isLoading ? <LoaderIcon className="w-6 h-6 animate-spin" /> : "Sign In"}
                    </Button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center">
                    <p className="text-white text-opacity-80 text-lg">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/signup" className="text-blue-300 hover:text-blue-100 font-semibold underline transition-colors duration-300">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;