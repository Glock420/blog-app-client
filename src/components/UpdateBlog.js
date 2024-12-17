import { useState, useEffect, useContext } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import UserContext from '../context/UserContext';

import {Notyf} from 'notyf';

export default function DeleteBlog({ post, fetchPost }){
    const { user } = useContext(UserContext);

    const notyf = new Notyf();

    const navigate = useNavigate();

    const [id, setId] = useState(post._id);
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);

    const [modal, setModal] = useState(false);

    const [isActive, setIsActive] = useState(false);

    const modalClose = () => setModal(false);
    const modalShow = () => setModal(true);

    const updatePost = (postId) => {
        fetch(`http://localhost:4000/posts/updatePost/${postId}`, {
            method: 'PATCH',
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
            if(data.message === 'Blog post updated successfully') {
                notyf.success("Blog post updated successfully");

                fetchPost();

                modalClose();
            } else {
                notyf.error("Could not update post");

                fetchPost();
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
            <Button variant="primary" className="ms-auto" onClick={modalShow}>Edit</Button>

            <Modal show={modal} onHide={modalClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Update Blog Post Details</Modal.Title>
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
                            <Button variant="success" className="ms-auto me-2" onClick={event => updatePost(post._id)}>Update</Button>
                        :
                            <Button variant="success" className="ms-auto me-2" disabled>Update</Button>
                        }
                        <Button variant="secondary" onClick={modalClose}>Close</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}