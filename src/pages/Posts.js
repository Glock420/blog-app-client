import { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import UserContext from '../context/UserContext';

import AddPost from '../components/AddPost';

export default function Posts() {
	const { user } = useContext(UserContext);

	const [posts, setPosts] = useState([]);

	const fetchPosts = () => {
		fetch(`http://localhost:4000/posts/getPosts`)
		.then(response => response.json())
		.then(data => {
			if(data.posts) {
				setPosts(data.posts)
			} else {
				setPosts([]);
			}
		});
	}

	useEffect(() => {
		fetchPosts();
	}, [user]);

	return(
		<>
            <h1 className="my-5 text-center">Blog Posts</h1>
            <Row className="d-flex justify-content-center">
            	<Col className="col-12 d-flex">
            		{(user.id !== null) ?
            			<AddPost fetchPosts={fetchPosts} />
            		:
            			null
            		}
            	</Col>
            </Row>
            <hr />
            <Row className="d-flex mx-auto mb-5 px-5">
                {(posts.length > 0) ?
                    posts.map(post => {
                        return(
                            <Col className="col-4 justify-content-center mt-4">
                                <Card className="h-100">
                                    <Card.Body className="h-100">
                                        <Card.Title className="text-center">{post.title}</Card.Title>
                                    </Card.Body>

                                    <Card.Body className="h-100">
                                        <Card.Text>By: {post.authorName}</Card.Text>
                                    </Card.Body>

                                    <Card.Body className="h-100">
                                        <Card.Text className="mb-4">Posted On: {post.createdOn}</Card.Text>
                                        <Link className = "btn btn-primary" to = {`/posts/details/${post._id}`} >View Post</Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })
                :
                    <h1>Currently no Blog Posts Available :(</h1>
                }
            </Row>
        </>
	);
}