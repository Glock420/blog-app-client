import { useState, useContext } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import UserContext from '../context/UserContext';

import {Notyf} from 'notyf';

export default function DeleteBlog({ postId }){
    const { user } = useContext(UserContext);

    const notyf = new Notyf();

    const navigate = useNavigate();

    const [modal, setModal] = useState(false);

    const modalClose = () => setModal(false);
    const modalShow = () => setModal(true);

    const deletePost = (postId) => {
        fetch(`http://localhost:4000/posts/deletePost/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.message === 'Blog post deleted successfully') {
                notyf.success("Post is now deleted");

                navigate('/posts')
            } else {
                notyf.error("Could not delete");
            }
        });
    }

    return (
        <>
            {(user.isAdmin === true) ?
                <Button variant="danger" className="ms-auto" onClick={modalShow}>Delete</Button>
            :
                <Button variant="danger" className="ms-2" onClick={modalShow}>Delete</Button>
            }

            <Modal show={modal} onHide={modalClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Delete Blog Post Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this blog post?</p>
                </Modal.Body>
                <Modal.Footer>
                    <div class="d-flex">
                      <Button variant="danger" className="ms-auto me-2" onClick={event => deletePost(postId)}>Delete</Button>
                      <Button variant="secondary" onClick={modalClose}>Close</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}