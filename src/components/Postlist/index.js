import React from 'react';

import './index.css';
import Post from '../Post';

export default function Postlist({ array }) {
    return (
    <div className="images-wrapper">
      {array.map((entry) => {
        return(
            <Post post={entry} />
        )
      })}
    </div>
  );
}
