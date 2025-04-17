"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true); 
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    setLoading(true); 
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/user-details/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setFormData(res.data);
        setLoading(false);   
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);     
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...formData };

      if (!formData.password) {
        delete updatedData.password;    
      }
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/user-details/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      router.push("/admin/users");
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
  
      const imageUrl = res.data.secure_url;
  
      // حفظ رابط الصورة في backend
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user-details/${id}`,
        { profileImage: imageUrl },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
  
      setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
      alert("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading image");
    }
  };
  


  const renderInput = (label, name, type = "text") => (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type === "password" && showPassword ? "text" : type}
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        id={name}
        className="w-full border p-2 rounded pr-10"
      />
      {type === "password" && (
        <span
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-9 cursor-pointer text-blue-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      )}
    </div>
  );
  
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);


  const renderSelect = (label, name, options) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        id={name}
        className="w-full border p-2 rounded"
      >
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const renderCheckbox = (label, name) => (
    <div className="flex items-center">
      <input
        type="checkbox"
        name={name}
        checked={formData[name] || false}
        onChange={handleChange}
        id={name}
        className="mr-2"
      />
      <label htmlFor={name} className="text-sm text-gray-500">{label}</label>
    </div>
  );

  return (
<div className="max-w-5xl m-[15px] text-white bg-blue-100 rounded-[20px] p-[25px] sm:m-auto ">
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Edit User</h2>
      
      {/* Loader Spinner */}
      {loading ? (
            <div className="flex justify-center items-center min-h-screen flex-col gap-3.5 ">
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={100}
                height={30}
                className="hover:opacity-80 transition  "
              />
              <p className="text-black ml-4">Loading users...</p>
            </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Profile Image */}
          <div className="text-center">
            {formData.profileImage && (
              <img src={formData.profileImage} alt="Profile" className="mx-auto  object-cover rounded-full mb-4 w-[90px] h-[90px] sm:w-[120px] sm:h-[120px]" />
            )}
            <input type="file" name="profileImage" onChange={handleImageChange} className="text-blue-400" />
          </div>

          {/* Basic Info */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-400">
              {renderInput("Name", "name")}
              {renderInput("Email", "email", "email")}
              {renderInput("Job Title", "jobTitle")}
              {renderSelect("Gender", "gender", ["male", "female"])}
              {renderSelect("Marital Status", "maritalStatus", ["single", "married", "divorced"])}
              {renderInput("Birth Date", "birthDate", "date")}
              {renderInput("Age", "age", "number")}
              {renderInput("National ID", "nationalID")}
              {renderInput("National ID Expiry", "nationalIDExpiry", "date")}
            </div>
          </section>

          {/* Contact Info */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Contact Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-400">
              {renderInput("Governorate", "governorate")}
              {renderInput("National ID Address", "nationalIDAddress")}
              {renderInput("Personal Phone", "personalPhone")}
              {renderInput("Company Phone", "companyPhone")}
            </div>
          </section>

          {/* Contract Info */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Contract Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-400">
              {renderInput("Hire Date", "hireDate", "date")}
              {renderInput("Contract Start", "contractStart", "date")}
              {renderInput("Contract End", "contractEnd", "date")}
              {renderInput("Salary (EGP)", "salary", "number")}
              {renderInput("Transportation Allowance (EGP)", "transportationAllowance", "number")}
              {renderSelect("Insurance Status", "insuranceStatus", ["insured", "not_insured"])}
              {renderInput("Insurance Number", "insuranceNumber")}
              {renderInput("Qualification Name", "qualificationName")}
            </div>
          </section>
          {/* Account Settings */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Account Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-400">
              {renderInput("Password (leave blank to keep current)", "password", "password")}
              {renderSelect("Role", "role", ["employee", "admin"])}
            </div>
          </section>


          {/* Documents */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-400">
              {renderCheckbox("Qualification Original Available", "qualificationOriginalAvailable")}
              {renderCheckbox("Birth Certificate Available", "birthCertificateAvailable")}
              {renderCheckbox("Military Service Available", "militaryServiceAvailable")}
              {renderCheckbox("Criminal Record Available", "criminalRecordAvailable")}
              {renderCheckbox("Work Card Available", "workCardAvailable")}
              {renderCheckbox("Insurance Print Available", "insurancePrintAvailable")}
              {renderCheckbox("National ID Copy Available", "nationalIDCopyAvailable")}
              {renderCheckbox("Skills Certificate Available", "skillsCertificateAvailable")}
            </div>
          </section>

          <div className="flex justify-center gap-2 text-center">
            <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
              Update User
            </button>
            <Button
              variant="secondary"
              className="flex items-center gap-2 px-5 py-2 rounded-xl shadow-sm hover:bg-gray-200 transition-all"
              onClick={() => router.back()}
            >
              Back
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
