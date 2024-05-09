import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Exampleform.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = (props) => {
  return (
    <div className="profile field">
      <label className="profile label">{props.label}</label>
      <input
        type={props.type || "text"}
        className="profile input"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={props.disabled}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [username, setUsername] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date>();
  const [isEditable, setIsEditable] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users/${userId}`);
        //if userlist is empty return to login page, so error doesn't appear
        if (response.data.length === 0) {
          localStorage.removeItem("viewedUserId");
          navigate("/game");
        }

        setUser(response.data);
        setUsername(response.data.username);
        setBirthDate(response.data.birthDate);

        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);

        console.log(response);
      } catch (error) {
        console.log(
          `Something went wrong when fetching the user: \n${handleError(error)}`
        );
        console.error("Details:", error);
          const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "An unknown error occurred";
          alert(
            `${errorMessage}`
          );
      }
    }

    fetchData();
  }, []);

  const doEdit = () => {
    setIsEditable(!isEditable);
  };

  const doSave = async () => {
    try {
      if (!userId) {
        alert("User ID not found.");

        return;
      }

      const requestBody = JSON.stringify({ username, birthDate });
      const response = await api.put(`/users/update/${userId}`, requestBody);
      const updatedUser = new User(response.data);

      setUser(updatedUser);
      setUsername(updatedUser.username);
      setBirthDate(updatedUser.birthDate);
      setIsEditable(false);
    } catch (error) {
      console.log(
        `Something went wrong during the user update: \n${handleError(error)}`
      );
      console.error("Details:", error);
        const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An unknown error occurred";
        alert(
          `${errorMessage}`
        );
    }
  };

  const doCancel = () => {
    setIsEditable(false);
    setUsername(user.username);
    setBirthDate(user.birthDate);
  };

  const doBack = () => {
    localStorage.removeItem("viewedUserId");
    navigate("/game");
  };

  if (user) {
    return (
      <BaseContainer>
        <div className="profile container">
          <div className="profile form">
            <FormField
              label="Username"
              placeholder="enter username.."
              disabled={!isEditable}
              value={username}
              onChange={(un) => setUsername(un)}
            />
            <FormField
              label="Status"
              placeholder="enter password.."
              disabled={true}
              value={user.status}
            />
            <FormField
              label="Birth date"
              type="date"
              disabled={!isEditable}
              value={birthDate}
              onChange={(n) => setBirthDate(n)}
            />
            <FormField
              label="Creation date"
              type="date"
              disabled={true}
              value={user.createDate}
            />

            {isEditable ? (
              <>
                <div className="profile button-container">
                  <Button
                    style={{ backgroundColor: "#53c653" }}
                    width="100%"
                    onClick={doSave}
                    disabled={username === ""}
                  >
                    Save
                  </Button>
                </div>
                <div className="register button-container">
                  <Button
                    style={{ backgroundColor: "#ff6666" }}
                    width="100%"
                    onClick={doCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="profile button-container">
                  <Button
                    disabled={
                      !(
                        localStorage.getItem("id") ===
                        localStorage.getItem("viewedUserId")
                      )
                    }
                    width="100%"
                    onClick={() => doEdit()}
                  >
                    Edit
                  </Button>
                </div>
                <div className="register button-container">
                  <Button width="100%" onClick={doBack}>
                    Back to Userlist
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </BaseContainer>
    );
  }
};

export default Profile;
