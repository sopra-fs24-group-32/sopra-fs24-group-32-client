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
    localStorage.removeItem("userToken");
    // navigate("/login");
    // await api.post(`/logout/${id}`);
  }

  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    birthdate: "",
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
          birthdate: response.data.birthdate || "",
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
      navigate(`/game/${id}`);
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
          Birthdate:
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
          />
        </label>
        <Button type="submit">Update User</Button>
      </form>
      <Button onClick={() => navigate(`/game/${id}`)}>Cancel</Button>
    </div>
  );
};

export default UserChange;
