import { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Card, Form } from 'react-bootstrap';
import { Navigate, useParams, useNavigate, Link } from 'react-router-dom';

import UserContext from '../context/UserContext';

import DeleteBlog from '../components/DeleteBlog';

import { Notyf } from 'notyf';

export default function PostDetails() {
    const { user } = useContext(UserContext);

    const { postId } = useParams();

    const navigate = useNavigate();

    const notyf = new Notyf();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [dateCreated, setDateCreated] = useState('');

    useEffect(() => {
        fetch(`http://localhost:4000/posts/getPost/${postId}`)
        .then(response => response.json())
        .then(data => {
            if(data) {
                setTitle(data.title);
                setContent(data.content);
                setAuthorId(data.authorId);
                setAuthorName(data.authorName);
                setDateCreated(data.createdOn);
            } else {
                navigate('/posts');
            }
        });
    }, [postId]);

    return(
        <Row className="d-flex justify-content-center mt-5">
            <Col className="col-8">
                <div className="d-flex mb-2">
                    {(user.id !== null) ?
                        (user.id === authorId) ?
                            <>
                                <Button variant="primary" className="ms-auto">Edit</Button>
                                <DeleteBlog postId={postId} />
                            </>
                        :
                            null
                    :
                        null
                    }
                    {(user.isAdmin === true) ?
                        <DeleteBlog postId={postId} />
                    :
                        null
                    }
                </div>
                <Card bg="dark" className="text-white">
                    <Card.Header as="h3" className="text-center">{title}</Card.Header>
                    <Card.Body>
                        <Card.Text className="mb-5">{content}</Card.Text>
                        <Card.Text>Posted By: {authorName}</Card.Text>
                        <Card.Text>Posted On: {dateCreated}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}