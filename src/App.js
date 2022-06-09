import "./App.css";
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

const TOKEN_KEY = "slack-clone-app:token-key";

const ChannelsContext = createContext();
const TokenContext = createContext();

function Channels() {
  const channels = useContext(ChannelsContext);

  return (
    <>
      <h2>Channels</h2>
      {channels !== null && (
        <ul>
          {channels.map(({ id, name }) => (
            <li key={id}>
              <Link to={`/channels/${id}`}>{name}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Home() {
  return (
    <>
      <h1>Home</h1>
      <Channels />
    </>
  );
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useContext(TokenContext);
  const navigate = useNavigate();

  async function handleChange(event) {
    const { name, value } = event.target;

    if (name === "username") {
      setUsername(value);
      return;
    }

    if (name === "password") {
      setPassword(value);
      return;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const request = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const { token } = await request.json();

    setToken(token);
    sessionStorage.setItem(TOKEN_KEY, token);
    navigate("/", { replace: true });
  }

  return (
    <>
      <h1>Login</h1>
      {token ? (
        <p>Logged in</p>
      ) : (
        <form onSubmit={(event) => handleSubmit(event)}>
          <label>
            Username:{" "}
            <input
              type="text"
              name="username"
              value={username}
              onChange={(event) => handleChange(event)}
            ></input>
          </label>
          <label>
            Password:{" "}
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => handleChange(event)}
            ></input>
          </label>
          <input type="submit" value="Submit" />
        </form>
      )}
    </>
  );
}

function Logout() {
  const [token, setToken] = useContext(TokenContext);
  const navigate = useNavigate();

  function handleClick() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    navigate("/", { replace: true });
  }

  return (
    <>
      <h1>Logout</h1>
      {token ? (
        <button onClick={() => handleClick()}>Logout</button>
      ) : (
        <p>Not logged in</p>
      )}
    </>
  );
}

function Channel() {
  const [messages, setMessages] = useState();
  const [newMessage, setNewMessage] = useState("");
  const { channelId } = useParams();
  const isFetchingMessages = useRef(false);
  const messagesUpdated = useRef(false);
  const webSocket = useRef();
  const [token] = useContext(TokenContext);

  useEffect(() => {
    if (isFetchingMessages.current || !channelId || !token) {
      return;
    }
    isFetchingMessages.current = true;

    async function fetchMessages() {
      const response = await fetch(
        `http://127.0.0.1:8000/api/channels/${channelId}/messages`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const body = await response.json();
      isFetchingMessages.current = false;

      if (!response.ok) {
        return;
      }

      setMessages(body.results);
      messagesUpdated.current = true;
    }

    fetchMessages();
  }, [channelId, token]);

  useEffect(() => {
    if (!channelId || !token) {
      return;
    }

    if (!webSocket.current) {
      webSocket.current = new WebSocket(
        `ws://127.0.0.1:8000/ws/channels/${channelId}/messages?${token}`
      );
    }

    webSocket.current.onmessage = function handleMessage(event) {
      const { content, username, created } = JSON.parse(event.data);

      setMessages([...messages, { content, username, created }]);
    };

    messagesUpdated.current = false;
    return () => {
      if (messagesUpdated.current) {
        return;
      }

      webSocket.current.close();
      webSocket.current = null;
    };
  }, [channelId, messages, token]);

  function handleChange(event) {
    setNewMessage(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    webSocket.current.send(JSON.stringify({ message: newMessage }));
    setNewMessage("");
  }

  return (
    <>
      <h1>Channel</h1>
      <Channels />
      <h2>Messages</h2>
      {messages && (
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              {message.username}: {message.content} ({message.created})
            </li>
          ))}
        </ul>
      )}
      {token && (
        <form onSubmit={(event) => handleSubmit(event)}>
          <label>
            New Message:{" "}
            <input
              type="text"
              name="message"
              value={newMessage}
              onChange={(event) => handleChange(event)}
            ></input>
          </label>
          <input type="submit" value="Submit" />
        </form>
      )}
    </>
  );
}

function App() {
  const [channels, setChannels] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem(TOKEN_KEY));
  const isFetchingChannels = useRef(false);

  useEffect(() => {
    if (!token) {
      setChannels(null);
      return;
    }

    if (isFetchingChannels.current || channels !== null) {
      return;
    }

    isFetchingChannels.current = true;

    async function fetchChannels() {
      const response = await fetch("http://127.0.0.1:8000/api/channels", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      isFetchingChannels.current = false;

      if (!response.ok) {
        return;
      }

      const body = await response.json();
      setChannels(body.results);
    }

    fetchChannels();
  }, [channels, token]);

  return (
    <>
      <TokenContext.Provider value={[token, setToken]}>
        <ChannelsContext.Provider value={channels}>
          <div className="App">
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="logout" element={<Logout />} />
                <Route path="channels">
                  <Route path=":channelId" element={<Channel />}></Route>
                </Route>
              </Routes>
            </main>
            <nav>
              <h2>Navigation</h2>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/logout">Logout</Link>
                </li>
              </ul>
            </nav>
          </div>
        </ChannelsContext.Provider>
      </TokenContext.Provider>
    </>
  );
}

export default App;
