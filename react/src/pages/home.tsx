/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

function Home() {
    const loggedUser = useSelector(
        (state: RootState) => state.auth.loggedInUser
    );
    return (
        <>
            <div>Home</div>
            {/* <img
                src={`http://localhost:8000/${loggedUser?.image_path}`}
                alt="Profilna slika"
            /> */}
        </>
    );
}

export default Home;
