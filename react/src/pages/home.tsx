/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const loggedUser = useSelector(
        (state: RootState) => state.auth.loggedInUser
    );
    return (
        <>
            <div className="chat-wrapper">
                <div className="users">
                    <div className="heading-wrapper">
                        <h2>
                            {/* <button onClick={() => navigate("/")}>
                                <span>Back</span>
                            </button> */}
                            Chat
                        </h2>
                    </div>
                    <div className="profile-wrapper">
                        <div className="img-wrapper">
                            <img
                                src={`http://localhost:8000/${loggedUser?.image_path}`}
                                alt="Profilna slika"
                            />
                        </div>
                        <div className="name">{loggedUser?.name}</div>
                        <div className="status">Available</div>
                    </div>
                    <div className="search-wrapper">
                        <input placeholder="Search" type="search" />
                    </div>
                    <div className="chats">
                        <div className="chat">
                            <div className="user-img-wrapper">
                                <img
                                    src="/icons/default-icon.png"
                                    alt="user-img"
                                />
                            </div>
                            <div className="text-wrapper">
                                <div className="chat-name">Kate Johnson</div>
                                <div className="chat-text">
                                    Some text she sends to...
                                </div>
                            </div>
                            <div className="chat-time">11:15</div>
                        </div>
                        <div className="chat">
                            <div className="user-img-wrapper">
                                <img
                                    src="/icons/default-icon.png"
                                    alt="user-img"
                                />
                            </div>
                            <div className="text-wrapper">
                                <div className="chat-name">Kate Johnson</div>
                                <div className="chat-text">
                                    Some text she sends to...
                                </div>
                            </div>
                            <div className="chat-time">11:15</div>
                        </div>
                    </div>
                </div>
                <div className="conversation">
                    {/* Poruke primljene od drugih korisnika */}
                    <div className="message received">
                        <div className="message-text">
                            Hey! How are you doing today?
                        </div>
                        <div className="message-time">11:05 AM</div>
                    </div>

                    <div className="message received">
                        <div className="message-text">
                            Are you free for a quick call?
                        </div>
                        <div className="message-time">11:06 AM</div>
                    </div>

                    {/* Poruke koje šalje korisnik */}
                    <div className="message sent">
                        <div className="message-text">
                            Hi! I’m good, thanks. Sure, I can talk now.
                        </div>
                        <div className="message-time">11:07 AM</div>
                    </div>

                    <div className="message sent">
                        <div className="message-text">
                            Where should we meet?
                        </div>
                        <div className="message-time">11:08 AM</div>
                    </div>
                    {/* Poruke primljene od drugih korisnika */}
                    <div className="message received">
                        <div className="message-text">
                            Hey! How are you doing today?
                        </div>
                        <div className="message-time">11:05 AM</div>
                    </div>

                    <div className="message received">
                        <div className="message-text">
                            Are you free for a quick call?
                        </div>
                        <div className="message-time">11:06 AM</div>
                    </div>

                    {/* Poruke koje šalje korisnik */}
                    <div className="message sent">
                        <div className="message-text">
                            Hi! I’m good, thanks. Sure, I can talk now.
                        </div>
                        <div className="message-time">11:07 AM</div>
                    </div>

                    <div className="message sent">
                        <div className="message-text">
                            Where should we meet?
                        </div>
                        <div className="message-time">11:08 AM</div>
                    </div>
                    {/* Poruke primljene od drugih korisnika */}
                    <div className="message received">
                        <div className="message-text">
                            Hey! How are you doing today?
                        </div>
                        <div className="message-time">11:05 AM</div>
                    </div>

                    <div className="message received">
                        <div className="message-text">
                            Are you free for a quick call?
                        </div>
                        <div className="message-time">11:06 AM</div>
                    </div>

                    {/* Poruke koje šalje korisnik */}
                    <div className="message sent">
                        <div className="message-text">
                            Hi! I’m good, thanks. Sure, I can talk now.
                        </div>
                        <div className="message-time">11:07 AM</div>
                    </div>

                    <div className="message sent">
                        <div className="message-text">
                            Where should we meet?
                        </div>
                        <div className="message-time">11:08 AM</div>
                    </div>
                    {/* Poruke primljene od drugih korisnika */}
                    <div className="message received">
                        <div className="message-text">
                            Hey! How are you doing today?
                        </div>
                        <div className="message-time">11:05 AM</div>
                    </div>

                    <div className="message received">
                        <div className="message-text">
                            Are you free for a quick call?
                        </div>
                        <div className="message-time">11:06 AM</div>
                    </div>

                    {/* Poruke koje šalje korisnik */}
                    <div className="message sent">
                        <div className="message-text">
                            Hi! I’m good, thanks. Sure, I can talk now.
                        </div>
                        <div className="message-time">11:07 AM</div>
                    </div>

                    <div className="message sent">
                        <div className="message-text">
                            Where should we meet?
                        </div>
                        <div className="message-time">11:08 AM</div>
                    </div>

                    {/* Input polje za slanje poruke */}
                    <div className="chat-input">
                        <input type="text" placeholder="Type a message..." />
                        <button className="btn-primary">
                            <span>Send</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
