'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { axiosQuery } from '@/lib/utils'

export default function User() {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [jwtToken, setJwtToken] = useState('')

    useEffect(() => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('jwtToken');
          setJwtToken(token ? token : '');
        }
     }, []);

    const registerUser = async (username : string, email : string, password : string) => {
        const response = await axiosQuery('/api/user/register', 'POST', { username: username, email: email, password: password })
        if (response) {
            localStorage.setItem('jwtToken', response.data.token)
            setJwtToken(localStorage.getItem('jwtToken') as string)
        } else {
            console.error('No response received')
        }
    };

    const loginUser = async (email : string, password : string) => {
        const response = await axiosQuery('/api/user/login', 'POST', { email: email, password: password })
        if (response) {
            localStorage.setItem('jwtToken', response.data.token)
            setJwtToken(localStorage.getItem('jwtToken') as string)
        } else {
            console.error('No response received')
        }
    };

    const handleRegisterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        registerUser(username, email, password);
    };

    const handleLoginClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        loginUser(email, password);
    };

    const handleLogoutClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        localStorage.removeItem('jwtToken')
        setJwtToken('')
    }

    return (
        <>
            { localStorage.getItem('jwtToken') || jwtToken ? (
                <div>
                    <h1>Connected</h1>
                    <Button onClick={handleLogoutClick}>Logout</Button>
                </div>
            ) : (
                <>
                    <Tabs defaultValue='register' className='w-[400px] absolute top-[20%] left-[50%]' style={{transform: 'translate(-50%)'}}>
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