import React, { useState, useEffect, useCallback } from "react";
import Lobby from "models/Lobby";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import "styles/views/Lobby.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

{
  /*}
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
{*/
}

const FormField = React.memo(({ label, name, value, onChange, options }) => {
  return (
    <div className="join field">
      <label className="join label">{label}</label>
      {options ? (
        <select
          name={name}
          className="register input"
          value={value}
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          className="register input"
          name={name}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
});

FormField.displayName = "FormField";

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.number),
  name: PropTypes.string.isRequired,
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
      console.error(
        `Something went wrong while creating the lobby: \n${handleError(error)}`
      );
      console.error("Details:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An unknown error occurred";
      alert(`${errorMessage}`);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: parseInt(value, 10),
    }));
  }, []);

  return (
    <BaseContainer>
      <div className="join container">
        <div className="join form">
          <FormField
            label="Amount of rounds"
            name="amtOfRounds"
            value={formData.amtOfRounds}
            onChange={handleChange}
            options={[1, 2, 3]}
          />
          <FormField
            label="Time limit to guess in seconds"
            name="timeLimit"
            value={formData.timeLimit}
            onChange={handleChange}
            options={[20, 30, 40, 50]}
          />
          <FormField
            label="Maximum amount of users"
            name="maxAmtUsers"
            value={formData.maxAmtUsers}
            onChange={handleChange}
            options={[2, 3, 4, 5]}
          />
          <div className="join button-container">
            <Button width="40%" onClick={createLobby}>
              Create Lobby
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default LobbyCreate;
