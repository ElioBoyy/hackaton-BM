'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { axiosQuery } from '@/lib/utils';

interface Response {
    status: number;
    data: any;
}

// Rest of the code...

export default function User() {
    const [isUserConnected, setUserConnected] = useState(false)
    const [userAction, setUserAction] = useState('login')

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    const registerUser = async (username : string, email : string, password : string) => {
        try {
            const response = await axios.post('/api/user', {
                username: username,
                email: email,
                password: password
            });
    
            // Assuming you want to do something with the response, like logging it
            console.log('User registered successfully:', response.data);
        } catch (error) {
            // Log the error message or the entire error object for debugging
            console.error('Failed to register user:', error.message);
        }
    };

    return (
        <>
            {isUserConnected ? (
                <div>
                    <h1>Connected</h1>
                </div>
            ) : (
                <>
                    <Tabs defaultValue='register' className='w-[400px]' style={{position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%)'}}>
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
                                    <Button className='w-[120px]' onClick={registerUser}>Register</Button>
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
                                        <Label htmlFor='username'>Username</Label>
                                        <Input id='username' placeholder='Cool_username_75' onChange={(e : any) => setUsername(e.target.value)} />
                                    </div>
                                    <div className='space-y-1'>
                                        <Label htmlFor='password'>Password</Label>
                                        <Input id='password' type='password' onChange={(e : any) => setPassword(e.target.value)} />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className='w-[120px]'>Login</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </>
        
    );
}