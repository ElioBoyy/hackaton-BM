'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { axiosQuery } from '@/lib/utils'
import HeaderUser from '@/components/headers/headerUser'
import { Divider } from '@nextui-org/divider'

interface User {
    id: number
    username: string
    email: string
}

export default function User() {
    const [token, setToken] = useState<string | null>(null)

    const [me, setMe] = useState<User>({ id: 0, username: "", email: "" })
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isModifing, setIsModifing] = useState(false)
    const [isModifingPassword, setIsModifingPassword] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('jwtToken')
        setToken(token)
    } , [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('jwtToken')
            setToken(token ? token : '')
        }
    }, [])

    useEffect(() => {
        if (token) {
            getMe()
        }
    }, [token])

    const getMe = async () => {
        const response = await axiosQuery('/api/me', 'GET', null, localStorage.getItem('jwtToken'))
        if (response) {
            setMe(response.data)
        } else {
            console.error('Error while getting me')
        }
    }

    const registerUser = async (username : string, email : string, password : string) => {
        if (await isUsernameExists(username)) {
            alert('Username already exists')
            return
        }
        if (await isEmailExists(email)) {
            alert('Email already exists')
            return
        }

        const response = await axiosQuery('/api/user/register', 'POST', { username: username, email: email, password: password }, null)
        if (response) {
            localStorage.setItem('jwtToken', response.data.token.token)
            setToken(localStorage.getItem('jwtToken') as string)
        } else {
            alert('Error while registering user, please try again')
        }
    }

    const loginUser = async (email : string, password : string) => {
        const response = await axiosQuery('/api/user/login', 'POST', { email: email, password: password }, null)
        if (response) {
            localStorage.setItem('jwtToken', response.data.token.token)
            setToken(localStorage.getItem('jwtToken') as string)
        } else {
            alert('Error while logging in, email or password is incorrect')
        }
    }

    const isUsernameExists = async (username : string) => {
        const response = await axiosQuery(`/api/users/username/${username}`, 'GET', null, localStorage.getItem('jwtToken'))
        if (response) {
            return response.data
        } else {
            console.error('No response received')
        }
    }
    const isEmailExists = async (email : string) => {
        const response = await axiosQuery(`/api/users/email/${email}`, 'GET', null, localStorage.getItem('jwtToken'))
        if (response) {
            return response.data
        } else {
            console.error('No response received')
        }
    }

    const updateUser = async (username: string, email : string, password : string) => {
        console.log(username, email, password)
        if (me.username !== username) {
            if (await isUsernameExists(username)) {
                alert('Username already exists')
                return
            }
        }
        if (me.email !== email) {
            if (await isEmailExists(email)) {
                alert('Email already exists')
                return
            }
        }

        const response = await axiosQuery(`/api/users/${me.id}`, 'PUT', { username: username, email: email, password: password }, localStorage.getItem('jwtToken'))
        if (response) {
            alert('User updated successfully')
        } else {
            console.log(response)
            alert('Error while updating user, please try again')
        }
    }

    const handleRegisterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        registerUser(username, email, password)
    }

    const handleLoginClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        loginUser(email, password)
    }

    const handleLogoutClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        localStorage.removeItem('jwtToken')
        setToken(null)
    }

    return (
        <>
            <HeaderUser />
            {token ? (
                <>
                {!isModifing ? (
                    <div>
                        <Button className='absolute top-[90px] left-[25px]' onClick={handleLogoutClick}>Logout</Button>
                        <Card className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8'>
                            <CardHeader className='flex flex-row gap-20'>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>Your profile</CardDescription>
                            </CardHeader>
                            <Divider className='mb-4' />
                            <CardContent className='flex flex-row gap-20'>
                                <div>
                                    <Label>Username</Label>
                                    <p>{me.username}</p>
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <p>{me.email}</p>
                                </div>
                            </CardContent>
                            <Divider/>
                            <CardFooter className='mt-8 justify-center' >
                                <Button color="primary" className='w-[120px]' onClick={(e:any) => {setIsModifing(true)}}>Modify</Button>
                            </CardFooter>
                        </Card>
                    </div>
                ) : (
                    <div>
                        <Button className='absolute top-[90px] left-[25px]' onClick={handleLogoutClick}>Logout</Button>
                        <Card className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8'>
                            <CardHeader>
                                <CardTitle>Profile update</CardTitle>
                            </CardHeader>
                            <Divider className='mb-4' />
                            <CardContent className='flex flex-col gap-8'>
                                <div>
                                    <Label>Username</Label>
                                    <Input id='username'  placeholder={me.username} onChange={(e : any) => setUsername(e.target.value)}/>
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input id='email' type='email' placeholder={me.email} onChange={(e : any) => setEmail(e.target.value)} />
                                </div>
                                <div>
                                    <div className='flex gap-5 mb-1'>
                                        <Label>Password</Label>
                                        <input type="checkbox" onChange={() => setIsModifingPassword(!isModifingPassword)}/>
                                    </div>
                                    {!isModifingPassword && (
                                        <Input id='password' type='password' onChange={(e : any) => setPassword(e.target.value)} disabled/>
                                    )}
                                    {isModifingPassword && (
                                        <Input id='password' type='password' onChange={(e : any) => setPassword(e.target.value)} />
                                    )}
                                </div>
                            </CardContent>
                            <Divider/>
                            <CardFooter className='mt-8 justify-center' >
                                <Button color="primary" className='w-[120px]' onClick={(e:any) => {updateUser(username, email, password); setIsModifing(false)}}>Modify</Button>
                            </CardFooter>
                        </Card>
                    </div>
                )}
                </>
            ) : (
                <>
                    <Tabs defaultValue='register' className='w-[400px] absolute origin-top top-[25%] left-[50%] transform -translate-x-[50%]'>
                        <TabsList className='grid w-full grid-cols-2'>
                            <TabsTrigger value='register' className='text-center'>Register</TabsTrigger>
                            <TabsTrigger value='login' className='text-center'>Login</TabsTrigger>
                        </TabsList>
                        <TabsContent value='register'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Register</CardTitle>
                                    <CardDescription>Register to play the game</CardDescription>
                                </CardHeader>
                                <CardContent className='space-y-2'>
                                    <div className='space-y-1'>
                                        <Label htmlFor='username'>Username</Label>
                                        <Input id='username' placeholder='Cool_username_75' onChange={(e : any) => setUsername(e.target.value)} />
                                    </div>
                                    <div className='space-y-1'>
                                        <Label htmlFor='email'>Email</Label>
                                        <Input id='email' placeholder='m.s@gmail.com' type='email' onChange={(e : any) => setEmail(e.target.value)} />
                                    </div>
                                    <div className='space-y-1'>
                                        <Label htmlFor='password'>Password</Label>
                                        <Input id='password' type='password' onChange={(e : any) => setPassword(e.target.value)} />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button color="primary" className='w-[120px]' onClick={handleRegisterClick}>Register</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value='login'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Login</CardTitle>
                                    <CardDescription>Login to play the game</CardDescription>
                                </CardHeader>
                                <CardContent className='space-y-2'>
                                    <div className='space-y-1'>
                                        <Label htmlFor='email'>Email</Label>
                                        <Input id='email' placeholder='m.s@gmail.com' onChange={(e : any) => setEmail(e.target.value)} />
                                    </div>
                                    <div className='space-y-1'>
                                        <Label htmlFor='password'>Password</Label>
                                        <Input id='password' type='password' onChange={(e : any) => setPassword(e.target.value)} />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button color="primary" className='w-[120px]' onClick={handleLoginClick}>Login</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </>
        
    );
}