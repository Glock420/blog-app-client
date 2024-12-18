import { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Form, Container } from 'react-bootstrap';

import UserContext from '../context/UserContext';

import { Notyf } from 'notyf';

export default function Register(){
	const { user } = useContext(UserContext);

	const navigate = useNavigate();
	const notyf = new Notyf();

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [isActive, setIsActive] = useState(false);

	useEffect(()=> {
		if(username !== "" && email !== "" && password !== '' && confirmPassword !== '' && password === confirmPassword) {
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	}, [username, email, password, confirmPassword]);


	const registerUser = (event) => {
		event.preventDefault();

		fetch(`https://blog-api-yb5u.onrender.com/users/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username,
				email,
				password
			})
		})
		.then(response => response.json())
		.then(data => {
			if(data.message === 'Registered Successfully') {
				setUsername('');
				setEmail('');
				setPassword('');
				setConfirmPassword('');

				notyf.success("Registration successful!");

				navigate("/login");
			} else if(data.error === 'Email invalid') {
				notyf.error('Email is invalid');
			} else if(data.error === 'Password must be atleast 8 characters') {
				notyf.error('Password must be at least 8 characters');
			} else {
				notyf.error("Something went wrong, try again!");
			}
		})
	}

	return(
		(user.id !== null) 
		?
			<Navigate to='/posts' />
		:
			<Container className="col-6 my-5 p-5 border border-secondary rounded">
				<Form className ="mx-auto" onSubmit = {event => registerUser(event)}>
					<h1 className = 'mb-5 text-center'>Register</h1>

					<Form.Group className="mb-3" >
				    	<Form.Label>Username:</Form.Label>
				        <Form.Control 
				        	type="text" 
				        	placeholder="Enter your username" 
				        	value = {username}
				        	onChange = {event => setUsername(event.target.value)}
				        	required/>
				    </Form.Group>

				    <Form.Group className="mb-3" >
				    	<Form.Label>Email:</Form.Label>
				        <Form.Control 
				        	type="email" 
				        	placeholder="Enter your email" 
				        	value = {email}
				        	onChange = {event => setEmail(event.target.value)}
				        	required/>
				    </Form.Group>

				    <Form.Group className="mb-3">
				        <Form.Label>Password:</Form.Label>
				        <Form.Control 
				        	type="password" 
				        	placeholder="Enter your password (atleast 8 characters)" 
				        	value = {password}
				        	onChange = {event => setPassword(event.target.value)}
				        	required/>
				    </Form.Group>

				    <Form.Group className="mb-3">
				        <Form.Label>Verify Password:</Form.Label>
				        <Form.Control 
				        	type="password" 
				        	placeholder="Verify your Password" 
				        	value = {confirmPassword}
				        	onChange = {event => setConfirmPassword(event.target.value)}
				        	required/>
				    </Form.Group>

				    <div className="d-grid gap-2 mt-5">
					    {isActive ?
							<Button variant="success" type="submit">Register</Button>
					    :
							<Button variant="success" type="submit" disabled>Register</Button>
					    }
				    </div>      
				</Form>
			</Container>
	);
}