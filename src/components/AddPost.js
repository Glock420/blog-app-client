import { useState, useEffect, useContext } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import UserContext from '../context/UserContext';

import {Notyf} from 'notyf';

export default function AddPost({ fetchPosts }){
    const { user } = useContext(UserContext);

    const notyf = new Notyf();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [modal, setModal] = useState(false);

    const [isActive, setIsActive] = useState(false);

    const modalClose = () => setModal(false);
    const modalShow = () => setModal(true);

    const addPost = () => {
        fetch(`http://localhost:4000/posts/addPost`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                content
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data) {
                notyf.success("Blog post added successfully");

                fetchPosts();

                setTitle('');
                setContent('');

                modalClose();
            } else {
                notyf.error("Could not add blog post");
            }
        });
    }

    useEffect(()=> {
        if(title !== "" && content !== "") {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [title, content]);

    return (
        <>
            <Button variant="primary" className="ms-auto" onClick={modalShow}>Create New Blog</Button>

            <Modal show={modal} onHide={modalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Blog Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="courseName">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={title}
                                onChange = {event => setTitle(event.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="courseDescription">
                            <Form.Label>Content</Form.Label>
                            <Form.Control  
                                type="text"
                                as="textarea"
                                rows={4}
                                value={content}
                                onChange={event => setContent(event.target.value)} 
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div class="d-flex">
                        {isActive ?
                            <Button variant="success" className="ms-auto me-2" onClick={addPost}>Create Post</Button>
                        :
                            <Button variant="success" className="ms-auto me-2" disabled>Create Post</Button>
                        }
                        <Button variant="secondary" onClick={modalClose}>Close</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}