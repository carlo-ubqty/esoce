"use client";

import { useState } from "react";

export default function RegisterForm({ userTypes, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "",
    firstName: "",
    surname: "",
    nickName: "",
    politicalParty: "",
    positionSought: "",
    province: "",
    cityMunicipality: "",
    district: "",
    region: "",
    contactNo: "",
    partyList: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [nickName, setNickName] = useState("");
  const [name, setName] = useState("");
  const [politicalParty, setPoliticalParty] = useState("");
  const [positionSought, setPositionSought] = useState("");
  const [province, setProvince] = useState("");
  const [cityMunicipality, setCityMunicipality] = useState("");
  const [district, setDistrict] = useState("");
  const [region, setRegion] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [partyList, setPartyList] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setSuccess("Registration successful! Check your email.");
      setFormData({
        email: "",
        password: "",
        userType: "",
        firstName: "",
        surname: "",
        nickName: "",
        politicalParty: "",
        positionSought: "",
        province: "",
        cityMunicipality: "",
        district: "",
        region: "",
        contactNo: "",
        partyList: "",
      });
      onRegisterSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">User Type</label>
        <select className="form-control" name="userType" value={formData.userType} onChange={handleChange} required>
          <option value="">Select User Type</option>
          {userTypes.map((type) => (
            <option key={type.user_type_id} value={type.user_type_value}>
              {type.user_type_name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">First Name</label>
        <input
          type="text"
          className="form-control"
          value={firstName}
          onChange={(e) => (
            setFirstName(e.target.value))}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Surname</label>
        <input
          type="text"
          className="form-control"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Nick Name</label>
        <input
          type="text"
          className="form-control"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Political Party</label>
        <input
          type="text"
          className="form-control"
          value={politicalParty}
          onChange={(e) => setPoliticalParty(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Position Sought</label>
        <input
          type="text"
          className="form-control"
          value={positionSought}
          onChange={(e) => setPositionSought(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Province</label>
        <input
          type="text"
          className="form-control"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">City Municipality</label>
        <input
          type="text"
          className="form-control"
          value={cityMunicipality}
          onChange={(e) => setCityMunicipality(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">District</label>
        <input
          type="text"
          className="form-control"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Region</label>
        <input
          type="text"
          className="form-control"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Contact No.</label>
        <input
          type="text"
          className="form-control"
          value={contactNo}
          onChange={(e) => setContactNo(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Party List</label>
        <input
          type="text"
          className="form-control"
          value={partyList}
          onChange={(e) => setPartyList(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-success w-100" disabled={loading}>
        {loading ? "Registering..." : "Create Account"}
      </button>
    </form>
  );
}
