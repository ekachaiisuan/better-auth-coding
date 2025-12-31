import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendVerificationEmail } from "@/lib/send-verification-email";
import { admin, twoFactor } from "better-auth/plugins"
import { sendOtpEmail } from "@/lib/send-otp-email";
import { sendResetPasswordEmail } from "@/lib/send-reset-password-email";
import { ac, roles } from "@/lib/permissions";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,

        sendResetPassword: async ({ user, url }, request) => {
            void sendResetPasswordEmail({
                to: user.email,
                subject: 'Reset your password',
                url
            })
        }

    },
    rateLimit: {
        enabled: true,
        window: 10,
        max: 2,
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendVerificationEmail({
                to: user.email,
                verificationURL: url,
                userName: user.name,
            })
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            prompt: "select_account",
        },
    },
    plugins: [
        admin({
            ac,
            roles,
            defaultRole: "user",
            adminRoles: ["admin", "superadmin"],
        }),
        nextCookies(),
        twoFactor({
            skipVerificationOnEnable: true,
            otpOptions: {
                async sendOTP({ user, otp }) {
                    sendOtpEmail({
                        to: user.email,
                        otp,

                    })
                }
            }
        })

    ]

});