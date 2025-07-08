"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import enGB from "date-fns/locale/en-GB";
registerLocale("en-GB", enGB);

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [birthDate, setBirthDate] = useState(null);
  const [nationalIDExpiry, setNationalIDExpiry] = useState(null);
  const [hireDate, setHireDate] = useState(null);
  const [contractStart, setContractStart] = useState(null);
  const [contractEnd, setContractEnd] = useState(null);
  const [resignationDate, setResignationDate] = useState(null);
  const [imageError, setImageError] = useState(""); // State to manage image upload error
  const [generalError, setGeneralError] = useState(""); // State to manage general errors

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/user-details/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setFormData(res.data);
        setBirthDate(res.data.birthDate ? new Date(res.data.birthDate) : null);
        setNationalIDExpiry(res.data.nationalIDExpiry ? new Date(res.data.nationalIDExpiry) : null);
        setHireDate(res.data.hireDate ? new Date(res.data.hireDate) : null);
        setContractStart(res.data.contractStart ? new Date(res.data.contractStart) : null);
        setContractEnd(res.data.contractEnd ? new Date(res.data.contractEnd) : null);
        setLoading(false);
        setResignationDate(res.data.resignationDate ? new Date(res.data.resignationDate) : null);

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
  
    const newErrors = {};
  
    if (formData.employeeStatus === "resigned" && !formData.resignationReason?.trim()) {
      newErrors.resignationReason = "Please enter the resignation reason.";
    }

    if (formData.employeeStatus === "resigned" && !resignationDate) {
      newErrors.resignationDate = "Please enter the resignation Date.";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; 
    }
  
    try {
      setGeneralError("");
      const updatedData = { ...formData };
  
      if (!formData.password) {
        delete updatedData.password;
      }

      if (resignationDate) {
        updatedData.resignationDate = resignationDate.toISOString().split("T")[0];
      }
  
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/user-details/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      router.push("/admin/users");
    } catch (err) {
      console.error(err);
      setGeneralError(err.response?.data?.message || err.message || "Error updating user");
    }
  };
  
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const formDataWithImage = new FormData();
    formDataWithImage.append("profileImage", file);
    setImageError(""); // reset error before upload
    setGeneralError(""); // reset general error before upload

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/user-details/upload/${id}`, formDataWithImage, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setFormData((prevData) => ({
          ...prevData,
          profileImage: res.data.profileImage,
        }));
        setImageError("");
        alert("Image uploaded successfully to Cloudinary!");
      })
      .catch((err) => {
        console.error("Error uploading image:", err.response?.data || err.message);
        setImageError(err.response?.data.message || err.message || "Error uploading image");
        setGeneralError(err.response?.data.message || err.message || "Error uploading image");
      });
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const renderInput = (label, name, type = "text") => {
    if (type === "date") {
      const dateMap = {
        birthDate,
        nationalIDExpiry,
        hireDate,
        contractStart,
        contractEnd,
      };

      const setDateMap = {
        birthDate: setBirthDate,
        nationalIDExpiry: setNationalIDExpiry,
        hireDate: setHireDate,
        contractStart: setContractStart,
        contractEnd: setContractEnd,
      };

      return (
        <div>
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <DatePicker
            selected={dateMap[name]}
            onChange={(date) => {
              setDateMap[name](date);
              setFormData({ ...formData, [name]: date?.toISOString().split("T")[0] });
            }}
            dateFormat="yyyy-MM-dd"
            locale="en-GB"
            className="w-full p-2  bg-white rounded focus:outline-none focus:ring-2 focus:ring-[#1fabaa] text-gray-900"
          />
        </div>
      );
    }

    return (
      <div className="relative">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
          type={type === "password" && showPassword ? "text" : type}
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          id={name}
          className="w-full  p-2 rounded pr-10 bg-white"
        />
        {type === "password" && (
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-9 cursor-pointer text-[#1fabaa]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        )}
      </div>
    );
  };

  const renderSelect = (label, name, options) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        id={name}
        className="w-full  p-2 rounded bg-white"
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
        className="mr-2 h-4 w-4 rounded-md border-gray-300 text-white accent-[#1fabaa] focus:ring-2 focus:ring-[#1fabaa]"
      />
      <label htmlFor={name} className="text-sm text-gray-500">{label}</label>
    </div>
  );

  return (
    <div className="max-w-5xl m-[15px] text-white bg-[#eee] rounded-[20px] p-[25px] sm:m-auto ">
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <h2 className="text-3xl font-bold mb-6 text-center text-[#1fabaa]">Edit User</h2>

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
          {generalError && (
            <div className="text-center mb-4">
              <p className="text-red-600 text-base font-semibold">{generalError}</p>
            </div>
          )}
          <div className="text-center">
            {formData.profileImage && (
              <img src={formData.profileImage} alt="Profile" className="mx-auto  object-cover rounded-full mb-4 w-[90px] h-[90px] sm:w-[120px] sm:h-[120px]" />
            )}
            <input type="file" name="profileImage" onChange={handleImageChange} className="text-[#1fabaa]" />
            {imageError && (
              <p className="text-red-600 text-sm mt-2">{imageError}</p>
            )}
          </div>

          {/* Basic Info */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-[#1fabaa]">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#1fabaa]">
              {renderInput("Name", "name")}
              {renderInput("Email", "email", "email")}
              {renderInput("Job Title", "jobTitle")}
              {renderSelect("Gender", "gender", ["male", "female"])}
              {renderSelect("Marital Status", "maritalStatus", ["single", "married", "divorced"])}
              {renderInput("Birth Date", "birthDate", "date")}
              {renderInput("Age", "age", "number")}
              {renderInput("National ID", "nationalID")}
              {renderInput("National ID Expiry", "nationalIDExpiry", "date")}
              {renderInput("Employee Code", "employeeCode")} 
            </div>
          </section>

          {/* Employee Status and resigned Reason */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-[#1fabaa]">Employee Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#1fabaa]">
            {renderSelect("Employee Status", "employeeStatus", ["active", "resigned"])}
            {formData.employeeStatus === "resigned" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderInput("Resigned Reason", "resignationReason")}
                  {errors.resignationReason && (
                    <p className="text-red-600 text-sm mt-1">{errors.resignationReason}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="resignationDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Resignation Date
                  </label>
                  <DatePicker
                    selected={resignationDate}
                    onChange={(date) => {
                      setResignationDate(date);
                      setFormData((prevData) => ({
                        ...prevData,
                        resignationDate: date?.toISOString().split("T")[0],
                      }));
                    }}
                    dateFormat="yyyy-MM-dd"
                    locale="en-GB"
                    className="w-full p-2 bg-white  rounded focus:outline-none focus:ring-2 focus:ring-[#1fabaa] text-gray-900"
                  />

                    {errors.resignationDate && (
                      <p className="text-red-600 text-sm mt-1">{errors.resignationDate}</p>
                    )}
                </div>
              </div>
            )}

            </div>
          </section>



          {/* Contact Info */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-[#1fabaa]">Contact Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#1fabaa]">
              {renderInput("Governorate", "governorate")}
              {renderInput("National ID Address", "nationalIDAddress")}
              {renderInput("Personal Phone", "personalPhone")}
              {renderInput("Company Phone", "companyPhone")}
            </div>
          </section>

          {/* Contract Info */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-[#1fabaa]">Contract Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#1fabaa]">
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
            <h3 className="text-xl font-semibold mb-4 text-[#1fabaa]">Account Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#1fabaa]">
              {renderInput("Password (leave blank to keep current)", "password", "password")}
              {renderSelect("Role", "role", ["employee", "admin"])}
            </div>
          </section>

          {/* Documents */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-[#1fabaa]">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#1fabaa]">
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
            <button type="submit" className="px-8 py-3 bg-[#1fabaa] text-white rounded-lg shadow-md hover:bg-[#147c7c] transition duration-300">
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

