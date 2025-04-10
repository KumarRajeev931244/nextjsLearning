"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {  useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/router"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {Loader2, Loader2Icon} from 'lucide-react'


/** yeah par hum kiya karege
 * 
 * username send karna hai.
 * backend se message jo aaya hai.
 * checking username
 * submitting the username
 */

const page = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debouncedUsername = useDebounceCallback(setUsername, 300)
    const router = useRouter()

    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues:{
            username: '',
            email: '',
            password: ''
        }
    })
    useEffect(() => {
        const checkUsernameUnique = async() => {
            if(username){
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/check-username-unique? username=${username}`)
                    setUsernameMessage(response.data.message) //TODO: console.log(response)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "error checking username"
                    )
                }finally{
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()
    }, [username])

    const onSubmit = async(data: z.infer<typeof signUpSchema>) => {
       setIsSubmitting(true)
       try {
        const response = await axios.post<ApiResponse>('/api/sign-up', data)
        toast("signin successfully")
        router.replace(`/verfy/${username}`)
        setIsSubmitting(false)
       } catch (error) {
        console.error("error in signup of user", error)
        const axiosError = error as AxiosError<ApiResponse>
        let errorMessage = axiosError.response?.data.message
        toast("signup failed")
        
       } 
    }
    
    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tacking-light lg:text-5xl mb-6">
                        hoin mystery message
                    </h1>
                    <p className="mb-4"> sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <input placeholder="write username" {...field}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        setUsername(e.target.value)
                                    }}
                                    />
                                    {isCheckingUsername && <Loader2 className="animate-spin"/>}
                                    <p className={`text-sm ${usernameMessage === "username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                                        test {usernameMessage}
                                    </p>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                    />
                    <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>email</FormLabel>
                                <FormControl>
                                    <input placeholder="write email" {...field}
            
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
                                    <input type="password" placeholder="write password" {...field}
            
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                    />
                    <Button type="submit" disabled= {isSubmitting}>
                        {
                            isSubmitting ? (
                                <>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />please wait
                                </>
                            ) : (toast('form sumitted successfully'))
                        }
                    </Button>
                    </form>
                </Form>
            </div>

        </div>
    )
}