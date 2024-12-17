import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import { UserProvider } from './context/UserContext';

import AppNavBar from './components/AppNavBar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import PostDetails from './pages/PostDetails';
import Logout from './pages/Logout';

function App() {
    const [user, setUser] = useState({
      id: null,
      isAdmin: null
    });

    const [isLoading, setIsLoading] = useState(true);

    const unsetUser = () => {
      localStorage.clear();
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (localStorage.getItem('token')) {
                try {
                    const response = await fetch(`http://localhost:4000/users/details`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    const data = await response.json();

                    if (data.user._id === undefined) {
                        setUser({ id: null, isAdmin: null });
                    } else {
                        setUser({ id: data.user._id, isAdmin: data.user.isAdmin });
                    }
                } catch (error) {
                    setUser({ id: null, isAdmin: null });
                }
            } else {
                setUser({ id: null, isAdmin: null });
            }
            
            setIsLoading(false);
        };

        fetchUserDetails();
    }, []);

    if (isLoading) return <div>Loading...</div>;

    return (
        <UserProvider value={{user, setUser, unsetUser}}>
          <Router>
            <AppNavBar />
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/posts/details/:postId" element={<PostDetails />} />
                <Route path="/logout" element={<Logout />} />
              </Routes>
            </Container>
          </Router>
        </UserProvider>
    );
}

export default App;