import  {  useEffect, useState } from 'react';
import { clearJwt, getToken, getCurrentUser, setUserId, setUserLog, getUser } from '../../utils/utils';

const Info = () => {

  const [user, setUser] = useState(null);
  const [check, setCheck] = useState("");

  useEffect(() => {
    const token = getToken();
    if (getUser() != null) {
      setUser(JSON.parse(getUser()));
    } else {
      if (token) {
        getCurrentUser()
          .then((response) => {
            console.log(response.data);
            setUser(response.data);
            setUserLog(JSON.stringify(response.data));
            setUserId(response.data.id);
          })
          .catch((error) => {
            console.log('Error fetching protected data:', error);
            console.log(error.response.data.error + " " + error.response.status)
            setCheck(error.response.data.error);
          });
      }
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
        <img src={user.picture} className='w-10 h-10' />
      </div>
      <div>
        <button onClick={clearJwt}>LogOut</button>
      </div>
    </div>
  );
};

export default Info;
