import { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Card, Form } from 'react-bootstrap';
import { Navigate, useParams, useNavigate, Link } from 'react-router-dom';

import UserContext from '../context/UserContext';

import DeleteBlog from '../components/DeleteBlog';
import UpdateBlog from '../components/UpdateBlog';

import { Notyf } from 'notyf';

export default function PostDetails() {
    const { user } = useContext(UserContext);

    const { postId } = useParams();

    const navigate = useNavigate();

    const notyf = new Notyf();

    const [post, setPost] = useState({});

    const fetchPost = () => {
        fetch(`http://localhost:4000/posts/getPost/${postId}`)
        .then(response => response.json())
        .then(data => {
            if(data) {
                setPost(data);
            } else {
                navigate('/posts');
            }
        });
    };

    useEffect(() => {
        fetchPost();
    }, [postId]);

    return(
        <Row className="d-flex justify-content-center mt-5">
            <Col className="col-8">
                <div className="d-flex mb-2">
                    {(user.id !== null) ?
                        (user.id === post.authorId) ?
                            <>
                                <UpdateBlog post={post} fetchPost={fetchPost} />
                                <DeleteBlog postId={post._id} />
                            </>
                        :
                            null
                    :
                        null
                    }
                    {(user.isAdmin === true) ?
                        <DeleteBlog postId={post._id} />
                    :
                        null
                    }
                </div>
                <Card bg="dark" className="text-white">
                    <Card.Header as="h3" className="text-center">{post.title}</Card.Header>
                    <Card.Body>
                        <Card.Text className="mb-5">{post.content}</Card.Text>
                        <Card.Text>Posted By: {post.authorName}</Card.Text>
                        <Card.Text>Posted On: {post.createdOn}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}