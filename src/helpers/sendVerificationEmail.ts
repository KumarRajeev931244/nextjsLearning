import { resend } from '@/lib/resend'
import VerificationEmail from '../../emails/verificationEmail'
import { ApiResponse } from '@/types/ApiResponse'

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'you@example.com',
            to: email,
            subject: 'Mystry message | verification code',
            react: VerificationEmail({username, otp: verifyCode}),
          });
        return {success: true, message: "verification email send successfully"}
        
    } catch (emailError) {
        console.error("error sending verification email:", emailError)
        return {success: false, message: "failed to send verification email"}
        
    }
}