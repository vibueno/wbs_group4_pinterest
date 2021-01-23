import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import FilterUser from './components/Filters/FilterUser';
import FilterBestPosts from './components/Filters/FilterBestPosts';

import AllPosts from './views/AllPosts';
import UserPosts from './views/UserPosts';
import BestPosts from './views/BestPosts';
import PostDetails from './views/PostDetails';

import GoBackButton from './components/GoBackButton';
import Footer from './components/Footer';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const filterBestPosts = React.createRef();

  const formatDate = strDate => {
    return strDate.substring(0, 10);
  };

  const resetFilters = () => {
    filterBestPosts.current.checked = false;
  };

  useEffect(() => {
    const doRequests = async () => {
      let postsResponse = await axios.get(
        'https://cdn.contentful.com/spaces/kq9f5euhdm7x/environments/master/entries/?select=sys.id,fields&content_type=post&access_token=2x9QLBM2YqXGk3Pv4AKeEXF4AqqMVW0BuGsd144eP1c'
      );
      let usersResponse = await axios.get(
        'https://cdn.contentful.com/spaces/kq9f5euhdm7x/environments/master/entries/?select=sys.id,fields&content_type=user&access_token=2x9QLBM2YqXGk3Pv4AKeEXF4AqqMVW0BuGsd144eP1c'
      );

      postsResponse = postsResponse.data.items;
      usersResponse = usersResponse.data.items;

      const posts = postsResponse.map(({ sys, fields }) => ({
        id: sys.id,
        date: formatDate(fields.date),
        title: fields.title,
        description: fields.description,
        image: fields.image,
        rating: fields.rating,
        userId: fields.userref.sys.id
      }));

      const users = usersResponse.map(({ sys, fields }) => ({
        id: sys.id,
        userName: fields.username
      }));

      posts.forEach(post => {
        const user = usersResponse.filter(
          user => user.sys.id === post.userId
        )[0];
        post.userName = user.fields.username;
        post.firstName = user.fields.firstname;
        post.lastName = user.fields.lastname;
      });

      setPosts(posts);
      setUsers(users);
    };

    doRequests();
  }, []);

  return (
    <div>
      <header>
        <h1 className="header-heading">Pinterest(ing)</h1>
        <div className="buttons-wrapper">
          <GoBackButton className="home-button" caption="Home" home="yes" />
          <div className="line"></div>
          <form className="user-selection">
            <label htmlFor="users">Choose a user:</label>
            {users.length ? (
              <FilterUser users={users} resetFilters={resetFilters} />
            ) : null}
          </form>
          <div className="line"></div>
          <FilterBestPosts ref={filterBestPosts} />
        </div>
      </header>
      <main>
        {posts.length ? (
          <Switch>
            <Route path="/posts/best">
              <BestPosts posts={posts} />
            </Route>
            <Route path="/posts/user/:userId">
              <UserPosts posts={posts} />
            </Route>
            <Route path="/posts/:postId">
              <PostDetails posts={posts} />
            </Route>
            <Route path={['/', '/posts']}>
              <AllPosts posts={posts} />
            </Route>
          </Switch>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
