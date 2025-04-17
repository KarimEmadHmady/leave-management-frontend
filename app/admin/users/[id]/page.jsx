"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import axios from "axios";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/user-details/${params.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, [params.id]);

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/user-details/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("User deleted successfully!");
      router.push("/admin/users");
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Something went wrong while deleting the user.");
    }
  };

  const handleExportExcel = () => {
    if (!user) return;

    const data = [
      {
        Name: user.name,
        Email: user.email,
        Role: user.role,
        JobTitle: user.jobTitle,
        Salary: user.salary,
        TransportationAllowance: user.transportationAllowance,
        ContractStart: formatDate(user.contractStart),
        ContractEnd: formatDate(user.contractEnd),
        BirthDate: formatDate(user.birthDate),
        HireDate: formatDate(user.hireDate),
        Age: user.age,
        Gender: user.gender,
        MaritalStatus: user.maritalStatus,
        NationalID: user.nationalID,
        NationalIDExpiry: formatDate(user.nationalIDExpiry),
        Governorate: user.governorate,
        NationalIDAddress: user.nationalIDAddress,
        PersonalPhone: user.personalPhone,
        CompanyPhone: user.companyPhone,
        InsuranceStatus: user.insuranceStatus,
        InsuranceNumber: user.insuranceNumber,
        Qualification: user.qualificationName,
        AnnualLeave: user.leaveBalance?.annual,
        SickLeave: user.leaveBalance?.sick,
        UnpaidLeave: user.leaveBalance?.unpaid,
        QualificationOriginal: user.qualificationOriginalAvailable ? "Yes" : "No",
        BirthCertificate: user.birthCertificateAvailable ? "Yes" : "No",
        MilitaryService: user.militaryServiceAvailable ? "Yes" : "No",
        CriminalRecord: user.criminalRecordAvailable ? "Yes" : "No",
        WorkCard: user.workCardAvailable ? "Yes" : "No",
        InsurancePrint: user.insurancePrintAvailable ? "Yes" : "No",
        NationalIDCopy: user.nationalIDCopyAvailable ? "Yes" : "No",
        SkillsCertificate: user.skillsCertificateAvailable ? "Yes" : "No",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Details");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `${user.name.replace(/\s+/g, "_")}_Details.xlsx`);
  };

  if (!user)
    return (
      <div className="p-6">
        <div className="flex justify-center items-center min-h-screen flex-col gap-3.5 ">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={100}
            height={30}
            className="hover:opacity-80 transition"
          />
          <p className="text-gray-200 ml-4">Loading users...</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <Card className="p-8 bg-blue-100 shadow-lg rounded-xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-6">
          {user.profileImage && (
            <Image
              src={user.profileImage}
              alt="Profile"
              width={100}
              height={100}
              className="object-cover rounded-full border-2 shadow-md w-[75px] h-[75px] sm:w-[100px] sm:h-[100px]"
              priority
            />
          )}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-800">{user.name}</h2>
            <p className="text-gray-500 text-[12px] sm:text-sm">{user.email}</p>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-400">
          <Info label="Role" value={user.role} />
          <Info label="Job Title" value={user.jobTitle} />
          <Info label="Salary" value={`${user.salary} EGP`} />
          <Info label="Transportation" value={`${user.transportationAllowance} EGP`} />
          <Info label="Contract Start" value={formatDate(user.contractStart)} />
          <Info label="Contract End" value={formatDate(user.contractEnd)} />
          <Info label="Birth Date" value={formatDate(user.birthDate)} />
          <Info label="Hire Date" value={formatDate(user.hireDate)} />
          <Info label="Age" value={user.age} />
          <Info label="Gender" value={user.gender} />
          <Info label="Marital Status" value={user.maritalStatus} />
          <Info label="National ID" value={user.nationalID} />
          <Info label="ID Expiry" value={formatDate(user.nationalIDExpiry)} />
          <Info label="Governorate" value={user.governorate} />
          <Info label="ID Address" value={user.nationalIDAddress} />
          <Info label="Personal Phone" value={user.personalPhone} />
          <Info label="Company Phone" value={user.companyPhone} />
          <Info label="Insurance Status" value={user.insuranceStatus} />
          <Info label="Insurance Number" value={user.insuranceNumber} />
          <Info label="Qualification" value={user.qualificationName} />
        </div>

        {/* Documents */}
        <Section title="Documents Availability">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc ml-6 text-sm text-blue-800">
            {[
              ["Qualification Original", user.qualificationOriginalAvailable],
              ["Birth Certificate", user.birthCertificateAvailable],
              ["Military Service", user.militaryServiceAvailable],
              ["Criminal Record", user.criminalRecordAvailable],
              ["Work Card", user.workCardAvailable],
              ["Insurance Print", user.insurancePrintAvailable],
              ["National ID Copy", user.nationalIDCopyAvailable],
              ["Skills Certificate", user.skillsCertificateAvailable],
            ].map(([label, available]) => (
              <li key={label}>
                {label}: {available ? "✅" : "❌"}
              </li>
            ))}
          </ul>
        </Section>

        {/* Leave Balance */}
        <Section title="Leave Balance">
          <ul className="list-disc ml-6 text-blue-800">
            <li>Annual: {user.leaveBalance?.annual}</li>
            <li>Sick: {user.leaveBalance?.sick}</li>
            <li>Unpaid: {user.leaveBalance?.unpaid}</li>
          </ul>
        </Section>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mt-8 justify-center">
          <Button
            className="w-[90%] sm:w-auto flex items-center gap-2 px-5 py-2 rounded-xl shadow-md bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push(`/admin/users/edit/${user._id}`)}
          >
            <PencilIcon className="h-5 w-5" />
            Edit
          </Button>

          <Button
            className="w-[90%] sm:w-auto flex items-center gap-2 px-5 py-2 rounded-xl shadow-md bg-green-600 hover:bg-green-700"
            onClick={handleExportExcel}
          >
            🧾 Download Excel
          </Button>

          <Button
            variant="destructive"
            className="w-[90%] sm:w-auto flex items-center gap-2 px-5 py-2 rounded-xl shadow-md hover:bg-red-700"
            onClick={handleDelete}
          >
            <TrashIcon className="h-5 w-5" />
            Delete
          </Button>

          <Button
            variant="secondary"
            className="w-[90%] sm:w-auto flex items-center gap-2 px-5 py-2 rounded-xl shadow-sm hover:bg-gray-200"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-gray-50 p-3 rounded border">
      <span className="font-medium">{label}:</span> {value || "N/A"}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      {children}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
