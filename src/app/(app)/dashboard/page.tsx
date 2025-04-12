'use client'

import { useCallback, useEffect, useState } from "react"
import { Message } from "@/model/User.model"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
const page = () => {
    const [message, setMessage] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const handleDeleteMessage = (messageId: string) => {
        setMessage(message.filter((message) => message._id !== messageId))
        const {data: session} = useSession()
        const form = useForm({
            resolver: zodResolver(acceptMessageSchema)
        })
        const {register, watch, setValue} = form
        const acceptMessages = watch('acceptMessage')
        
        const fetchAcceptMessage = useCallback(async () => {
            setIsSwitchLoading(true)
            try {
                const response = await axios.get(`/api/accept-messages`)
                setValue('acceptMessage', response.data.isAcceptingMessage)
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                toast("error ")

                
            }finally{
                setIsSwitchLoading(false)

            }
        }, [setValue])
    }
    const fetchMessages  = useCallback(async( refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(false)
        try {
            const response = await axios.get<ApiResponse>(`/api/get-messages`)
            setMessage(response.data.messages || [])
            if(refresh){
                toast(" refresh messages")
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast("error ")

        } finally{
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    },[setIsLoading, setMessage])

    useEffect(() => {
        if(!session || !session.user) return
        fetchMessages()
        fetchAcceptMessage()
    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    // handle switch change
    const handleSwitchchange = async() => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages
            })
            setValue('acceptMessages', !acceptMessage)
            
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast("error ")
        }
    }
    if(session || !session.user){
        return <div>Please login</div>
    }

    return (
        <div>dashboard</div>
    )
}
export default page