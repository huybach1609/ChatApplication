import React, { useEffect, useState } from 'react';
import { clearJwt, getToken, getCurrentUser } from '../../utils/utils';

const Info = () => {
  const [user, setUser] = useState(null);
  const [check, setCheck] = useState("");

  useEffect(() => {
    const token = getToken();

    if (token) {
      getCurrentUser()
        .then((response) => {
          console.log(response.request.status);
          setUser(response.data);
        })
        .catch((error) => {
          console.log('Error fetching protected data:', error);
          console.log(error.response.data.error + " " + error.response.status)
          setCheck(error.response.data.error);
        });
    }
  }, []);

  if (check) {
    return <div>{check}</div>
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <h2>Protected Page</h2>
        <p>Welcome, {user.email}</p>
        <img src={user.picture} />
      </div>
      <div>
        <button onClick={clearJwt}>LogOut</button>
      </div>
    </div>
  );
};

export default Info;
