import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import { User } from "types";
import PropTypes from "prop-types";

const FormField = React.memo((props) => {
  return (
    <div className="user-change field">
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

const UserChange = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  async function logout() {
    const userToken = localStorage.getItem("userToken");
    const requestBody = JSON.stringify({ userToken });
    localStorage.removeItem("userToken");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    // eslint-disable-next-line
    await api.post(`/logoutByToken`, requestBody);
    navigate("/login");
  }

  const [user, setUser] = useState<User | null>(null);
  const [profilePic, setProfilePic] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [fileChanged, setFileChanged] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    birthDay: "",
    email: "",
    status: "",
    createdAt: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);

        // Update formData state here after the user is fetched
        setFormData({
          id: response.data.id,
          username: response.data.username || "",
          birthDay: response.data.birthDay || "",
          email: response.data.email || "",
          status: response.data.status || "",
          createdAt: response.data.createDate || "",
          picture: response.data.picture || null,
        });
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
  }, [id]); // Dependency array to re-fetch data if `id` changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "birthDay" && value) {
      const year = value.split("-")[0];
      if (parseInt(year, 10) > 9999) {
        setErrorMessage("Year cannot be more than 9999.");

        return;
      } else {
        setErrorMessage("");
      }
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(formData, "--------------------formData");
      // eslint-disable-next-line
      const updatedUser = await api.put(`/users/update/${id}`, formData);
      console.log("User updated:", updatedUser.data);
      localStorage.setItem("username", formData.username);
      navigate(`/user/${id}`);
      if (fileChanged) {
        window.location.reload();
      }
    } catch (error) {
      console.error(
        `Something went wrong while updating the user: \n${handleError(error)}`
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

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfilePic(URL.createObjectURL(file));
      convertToBase64(file);
      setFileChanged(true);
    } else {
      console.error("No file chosen or file input is not recognized");
      alert("No file chosen or file input is not recognized");
    }
  };

  const convertToBase64 = (file) => {
    if (!(file instanceof Blob)) {
      console.error("The provided file is not a Blob or File.");

      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageData(reader.result.toString().split(",")[1]);
      setFormData((prevFormData) => ({
        ...prevFormData,
        picture: reader.result.toString().split(",")[1],
      }));
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
  };

  const formatBase64Image = (base64) => {
    if (!base64.startsWith("data:image/")) {
      return `data:image/jpeg;base64,${base64}`;
    }

    return base64;
  };

  // Check if user data is still loading
  if (!user) {
    return <Spinner />;
  }

  return (
    <BaseContainer
      className="game container"
      style={{ background: "transparent", boxShadow: "none", paddingTop: "0" }}
    >
      <h2>Edit User Details</h2>
      <div className="join container">
        <div className="user-change form">
          {profilePic && (
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <img
                src={profilePic}
                alt="Profile Preview"
                style={{ borderRadius: "50%", width: "150px", height: "150px" }}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ width: "320px" }}>
            {/* Assuming id is not editable but shown for reference */}
            <p>User ID: {formData.id}</p>
            <FormField
              label="Username"
              type="text"
              name="username"
              key="username"
              placeholder="enter new username.."
              value={formData.username}
              onChange={handleChange}
            />
            <FormField
              label="Birth Date"
              type="date"
              name="birthDay"
              key="birthDay"
              placeholder="enter new username.."
              value={formData.birthDay}
              onChange={handleChange}
            />
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <FormField
              label="Email"
              type="email"
              name="email"
              key="email"
              placeholder="enter your email.."
              value={formData.email}
              onChange={handleChange}
            />
            <p>Upload Profile Picture</p>
            <input
              type="file"
              accept="image/*"
              label="upload"
              onChange={handleFileChange}
            />
            <br></br>
            <br></br>
            <Button
              type="submit"
              width="100%"
              style={{ backgroundColor: "#59CF49", marginBottom: "10px" }}
              disabled={
                !formData.username && !formData.birthDay && !formData.email
              }
            >
              Update User
            </Button>
            <br></br>
            <Button
              width="100%"
              style={{
                backgroundColor: "#ff6666",
                marginBottom: "10px",
              }}
              onClick={() => navigate(`/user/${id}`)}
            >
              Cancel
            </Button>
          </form>
        </div>
      </div>
    </BaseContainer>
  );
};

export default UserChange;
