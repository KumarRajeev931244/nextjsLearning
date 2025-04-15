'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const page = () => {
    
    const router = useRouter()
    // zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        // resolver: resolver can 
        resolver: zodResolver(signInSchema),
        defaultValues:{
            identifier: '',
            password: ''
        }
    })
    const onSubmit = async(data: z.infer<typeof signInSchema>) => {
       const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
       })
       if(result?.error){
        toast("incorrect  email or passoword")
       }
       if(result?.url){
        toast("login successfully")
        router.replace('/dashboard')
       }
       } 
    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tacking-light lg:text-5xl mb-6">
                        join mystery message
                    </h1>
                    <p className="mb-4"> sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>email</FormLabel>
                                <FormControl>
                                    <Input placeholder="write email" {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                    />
                    <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="write password" {...field}
            
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                    />
                    <Button type="submit" >
                        signIn
                    </Button>
                    </form>
                </Form>
            </div>

        </div>
    )
}

export default page