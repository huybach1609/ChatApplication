import { isAuthenticated, clearJwt } from "../../utils/utils";

const Navbar = () => {
    return (
        <div className='flex gap-3'>
            {isAuthenticated ?
                <button onClick={clearJwt}>logout</button>
                :
                <a href='/login'>login</a>
            }
            <a href='/info'>info</a>
        </div>
    );
}
export default Navbar