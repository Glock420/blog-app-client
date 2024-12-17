import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

import UserContext from '../context/UserContext';

import { Notyf } from 'notyf';

export default function Login() {
    const { user, setUser } = useContext(UserContext);

    const notyf = new Notyf();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(true);


    function authenticate(e) {
        e.preventDefault();

        fetch(`http://localhost:4000/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.access){
                localStorage.setItem('token', data.access);

                retrieveUserDetails(data.access);

                setEmail('');
                setPassword('');

                notyf.success('Successful Login');
            } else if (data.error === "Email and password do not match") {
                notyf.error(`Incorrect credentials. Try again!`);
            } else {
                notyf.error(`${email} does not exist`);
            }
        })
    }

    function retrieveUserDetails(token){
        fetch(`http://localhost:4000/users/details`, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(response => response.json())
        .then(data => {
            setUser({
                id: data.user._id,
                isAdmin: data.user.isAdmin
            })
        })
    }


    useEffect(() => {
        if(email !== '' && password !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);

    return(
        (user.id !== null)
            ?
                <Navigate to='/posts' />
            :    
                <>
                    <Container className="col-6 mt-5 p-5 border border-secondary rounded">
                        <Form onSubmit={(e) => authenticate(e)}>
                            <h1 className="mb-5 text-center">Login</h1>

                            <Form.Group>
                                <Form.Label>Email address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter your email here" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="my-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Enter your password here" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>

                            <div className="d-grid gap-2 mt-5">
                                {isActive ? 
                                    <Button variant="success" type="submit" id="loginBtn">Login</Button>
                                : 
                                    <Button variant="success" type="submit" id="loginBtn" disabled>Login</Button>
                                }
                            </div> 
                        </Form> 
                    </Container>
                    <p className = 'mt-4 text-center'>Don't have an account yet? <a href="/register" className="text-decoration-none">Click here</a> to register.</p>
                </> 
    );
}