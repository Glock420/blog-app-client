import { useState, useEffect, useContext } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import UserContext from '../context/UserContext';

export default function Posts() {
	const { user } = useContext(UserContext);

	const [posts, setPosts] = useState([]);

	useEffect(() => {
		fetch(`http://localhost:4000/posts/getPosts`)
		.then(response => response.json())
		.then(data => {
			if(data.posts) {
				setPosts(data.posts)
			} else {
				setPosts([]);
			}
		})
	}, [user]);

	return(
		<>
            <h1 className="my-5">Blog Posts</h1>
            <Row className="d-flex mx-auto my-5 px-5">
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