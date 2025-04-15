'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { log } from "console"
const page = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounced = useDebounceCallback(setUsername,300)
    const router = useRouter()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        // it used to cleanup the value
        defaultValues:{
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        // defining the function inside useEffect to avoid creating a new function on every render
        const checkUsernameUnique = async() => {
            if(username){
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/check-username-unique? username=${username}`)
                    let message = response.data.message
                    setUsernameMessage(message) 
                    //TODO: console.log(response)
                    
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "error checking username"
                    )
                } finally{
                    setIsCheckingUsername(false)
                }

            }
        }
        checkUsernameUnique()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up',data)
            toast("successfully sign up", {
                description:response.data.message
            })
            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        } catch (error) {
            console.error("error in signup of user", error)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast("signup failed",{
                    description: errorMessage
            })
            setIsSubmitting(false)
        }
    }

    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tacking-light lg:text-5xl mb-6">Join Mystry Message
                    </h1>
                    <p className="mb-4"> sign up to start your anonymous adventure</p>                 
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField 
                        name="username"
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="username" {...field}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            debounced(e.target.value)
                                        }}
                                        
                                    />
                                    
                                    
                                </FormControl>
                                {isCheckingUsername && <Loader2 className="animate-spin"/>}
                                <p className={`text-sm ${usernameMessage === "username is unique" ? 'text-green-500' : 'text-red-500'}`}> {usernameMessage}

                                </p>
                            </FormItem>
                        )}
                        >
                        
                            
                        </FormField>
                        <FormField 
                        name="email"
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="email" {...field}
                                    />
                                    
                                </FormControl>
                            </FormItem>
                        )}
                        >
                        
                            
                        </FormField>
                        <FormField 
                        name="password"
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="password" {...field}
                                    />
                                    
                                </FormControl>
                            </FormItem>
                        )}
                        >
                        
                            
                        </FormField>
                        <Button type="submit" disabled= {isSubmitting}>
                        {
                            isSubmitting ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />please wait
                                </>
                            ) : ('Signup')
                        }
                    </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                        <p>
                            Already a member?{""}
                            <Link href='/sign-in' className="text-blue-600 hover:text-blue-800">Sign-in</Link>
                        </p>
                </div>
            </div>
        </div>
    )
}

export default page