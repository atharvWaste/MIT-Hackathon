import { useState } from "react";

const SignBox = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.password.length < 6) newErrors.password = "Min 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) submitForm();
  };

  const submitForm = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Server error");

      setSuccess(true);
    } catch (err) {
      setErrors({ server: err.message });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "2px solid #84b7ff",
    borderRadius: "30px",
    background: "#cae0ff",
    marginBottom: "6px",
  };

  return (
    <section
      style={{
        width: "100vw",
        height: "100vh",
        background: "#111111",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <div>{/* YOUR CONTENT */}</div>

      <div>
        {success ? (
          <p style={{ color: "#84ffb7", fontSize: "20px" }}>
            ✓ Logged in successfully!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "#30313198",
              padding: "50px",
              borderRadius: "25px",
              minWidth: "300px",
            }}
          >
            <input
              type="email"
              autoComplete="off"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.email && (
              <p style={{ color: "#ff8484", fontSize: "12px", marginBottom: "12px" }}>
                {errors.email}
              </p>
            )}

            <input
              type="password"
              autoComplete="off"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.password && (
              <p style={{ color: "#ff8484", fontSize: "12px", marginBottom: "12px" }}>
                {errors.password}
              </p>
            )}

            {errors.server && (
              <p style={{ color: "#ff8484", fontSize: "12px", marginBottom: "12px" }}>
                {errors.server}
              </p>
            )}

            <button
              type="submit"
              style={{
                padding: "10px 30px",
                border: "2px solid #84d4ffb1",
                background: "#55ff88",
                borderRadius: "30px",
                color: "#484848",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default SignBox;