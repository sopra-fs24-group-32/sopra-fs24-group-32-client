import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "types";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
    <div className="player name">{user.name}</div>
    <div className="player id">id: {user.id}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const UserDetail = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();
  const { id } = useParams();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://react.dev/learn/state-a-components-memory and https://react.dev/reference/react/useState
  const [user, setUser] = useState<User>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  async function logout() {
    const userToken = localStorage.getItem("userToken");
    const requestBody = JSON.stringify({ userToken });
    localStorage.removeItem("userToken");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    // eslint-disable-next-line
    await api.post(`/logoutByToken`, requestBody);
    navigate("/");
  }

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://react.dev/reference/react/useEffect
  useEffect(() => {
    // async function getAuthentication() {
    //   try {
    //     const userToken = localStorage.getItem("userToken");
    //     const requestBody = JSON.stringify({ userToken });
    //     // eslint-disable-next-line
    //     const response = await api.post(`/authenticate/${id}`, requestBody);
    //     setIsAuthenticated(response.data === true);
    //   } catch (error) {
    //     console.error(
    //       `Something went wrong while authenticating: \n${handleError(error)}`
    //     );
    //     console.error("Details:", error);
    //   }
    // }
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get(`/users/${id}`);
        console.log("requested data:", response.data);
        console.log("requested data:", response);
        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUser(response.data);

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log("requested data:", response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the user: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "An unknown error occurred";
        alert(`${errorMessage}`);
      }
    }

    fetchData();
    // getAuthentication();
  }, []);

  const formatBase64Image = (base64) => {
    if (!base64.startsWith("data:image/")) {
      return `data:image/jpeg;base64,${base64}`;
    }

    return base64;
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);

    return date.toLocaleDateString("de-CH", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  let content = <Spinner />;

  if (user) {
    content = (
      <div className="game">
        {user.picture && (
          <div
            className="picture"
            style={{ marginTop: "10px", textAlign: "center" }}
          >
            <img
              src={formatBase64Image(user.picture)}
              alt="Profile Pic"
              style={{
                borderRadius: "50%",
                width: "150px",
                height: "150px",
                align: "auto",
              }}
            />
          </div>
        )}
        <ul className="game user-list">
          <li key={user.id}>
            <div className="player container">
              <div className="player ">id: {user.id}</div>
            </div>
          </li>
          <li key={user.username}>
            <div className="player container">
              <div className="player username">username: {user.username}</div>
            </div>
          </li>
          <li key={user.email}>
            <div className="player container">
              <div className="player email">email: {user.email}</div>
            </div>
          </li>
          <li key={user?.birthdate}>
            <div className="player container">
              <div className="player birthdate">birthdate: {user.birthDay}</div>
            </div>
          </li>
          <li key={user?.status}>
            <div className="player container">
              <div className="player status">status: {user.status}</div>
            </div>
          </li>
          <li key={user.createdAt}>
            <div className="player container">
              <div className="player createdAt">
                createdAt: {formatDate(user.createDate)}
              </div>
            </div>
          </li>
        </ul>
        <Button
          width="100%"
          style={{ marginBottom: "10px" }}
          onClick={() => navigate(`/user/${id}/change`)}
        >
          Edit
        </Button>
        <Button
          width="100%"
          style={{ marginBottom: "10px" }}
          onClick={() => navigate("/home")}
        >
          Home Screen
        </Button>
        <Button
          width="100%"
          style={{ marginBottom: "10px", backgroundColor: "#ff6666" }}
          onClick={() => logout()}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer
      className="game container"
      style={{ background: "transparent", boxShadow: "none", paddingTop: "0" }}
    >
      <h2>Your Profile</h2>
      {content}
    </BaseContainer>
  );
};

export default UserDetail;
