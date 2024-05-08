import React, { useState, useEffect, useCallback } from "react";
import Lobby from "models/Lobby";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import "styles/views/Lobby.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = React.memo((props) => {
  return (
    <div className="join field">
      <label className="join label">{props.label}</label>
      <input
        type={props.type || "text"}
        className="register input"
        placeholder={props.placeholder || "enter here.."}
        name={props.name}
        key={props.key}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
});

FormField.displayName = "FormField";

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  key: PropTypes.string,
  placeholder: PropTypes.string,
};

const LobbyCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    maxAmtUsers: 5,
    amtOfRounds: 2,
    timeLimit: 30,
  });

  const createLobby = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const config = {
        headers: {
          userToken,
        },
      };
      const response = await api.post("/lobby/create", formData, config);

      const lobby = new Lobby(response.data);

      navigate(`/lobby/host/${lobby.id}`);
    } catch (error) {
      alert(
        `Something went wrong during the register: \n${handleError(error)}`
      );
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  return (
    <BaseContainer>
      <div className="join container">
        <div className="join form">
          <FormField
            label="Amount of rounds"
            type="number"
            name="amtOfRounds"
            key="amtOfRounds"
            placeholder="enter a number.."
            value={formData.amtOfRounds}
            onChange={handleChange}
          />
          <FormField
            label="Time limit to guess in seconds"
            type="number"
            name="timeLimit"
            key="timeLimit"
            placeholder="enter a number.."
            value={formData.timeLimit}
            onChange={handleChange}
          />
          <FormField
            label="Maxiumum amount of users"
            type="number"
            name="maxAmtUsers"
            key="maxAmtUsers"
            placeholder="enter a number.."
            value={formData.maxAmtUsers}
            onChange={handleChange}
          />
          <div className="join button-container">
            <Button width="50%" onClick={() => createLobby()}>
              Create Lobby
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default LobbyCreate;
