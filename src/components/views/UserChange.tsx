import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import { User } from "types";

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
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    birthDay: "",
    email: "",
    status: "",
    createdAt: "",
  });

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
          createdAt: response.data.createdAt || "",
        });
      } catch (error) {
        console.error(
          `Something went wrong while fetching the user: \n${handleError(
            error
          )}`
        );
        alert(
          "Something went wrong while fetching the user! See the console for details."
        );
      }
    }

    fetchData();
  }, [id]); // Dependency array to re-fetch data if `id` changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(formData, "formData");
      // eslint-disable-next-line
      const updatedUser = await api.put(`/users/${id}`, formData);
      console.log("User updated:", updatedUser.data);
      navigate(`/user/${id}`);
    } catch (error) {
      console.error(
        `Something went wrong while updating the user: \n${handleError(error)}`
      );
      alert(
        "Something went wrong while updating the user! See the console for details."
      );
    }
  };

  // Check if user data is still loading
  if (!user) {
    return <Spinner />;
  }

  return (
    <div className="user-change-page">
      <h2>Edit User Details</h2>
      <form onSubmit={handleSubmit}>
        {/* Assuming id is not editable but shown for reference */}
        <p>User ID: {formData.id}</p>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Birth Date:
          <input
            type="date"
            name="birthDay"
            value={formData.birthDay}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <Button type="submit">Update User</Button>
      </form>
      <Button onClick={() => navigate(`/user/${id}`)}>Cancel</Button>
    </div>
  );
};

export default UserChange;
