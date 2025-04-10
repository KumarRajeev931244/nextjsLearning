'use-client'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'

import { z } from 'zod'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@react-email/components'
import { useForm } from 'react-hook-form'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username: string}>()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })
    const onSubmit = async(data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })
            toast("success")
            router.replace('sign-in')
        } catch (error) {
            console.error("error in signup of user", error)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast("signup failed")
        
        }
    }
    return (
       <div className="lex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>code</FormLabel>
                        <FormControl>
                            <input placeholder="code" {...field} />
                        </FormControl>
    
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
    </Form>
            </div>
        </div>

       </div>
    )
}

export default VerifyAccount