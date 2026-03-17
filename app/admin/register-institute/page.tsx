"use client";

import { useState } from "react";
import { Copy, Building2, User, KeyRound, CheckCircle2, ArrowRight, ShieldCheck, Upload } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterInstituteForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  const [generatedPass, setGeneratedPass] = useState("");
  const [copied, setCopied] = useState(false);
  
  const defaultFormData = {
    name: "Registered Coaching Center",
    ownerDetails: {
      name: "",
      email: "",
      contact: "",
      aadhaarPan: "",
      photoUrl: ""
    },
    address: { street: "", areaLocality: "", city: "", state: "Uttar Pradesh", pincode: "" },
    infrastructure: { totalArea: 0, totalClassrooms: 0, classroomDimensions: "" },
    facilities: { drinkingWater: false, separateToilets: false, cctvInstalled: false, firstAid: false, ventilation: false, emergencyExits: false, facilityPhotos: [] as string[] },
    safetyCertificates: [
      { type: 'Fire', url: 'mock_fire_cert.pdf', aiVerificationStatus: 'Pending' },
      { type: 'Building', url: 'mock_building_cert.pdf', aiVerificationStatus: 'Pending' }
    ],
    undertakings: {
      noUnder16: false,
      noSchoolHours: false,
      graduateTutors: false,
      noMisleadingAds: false,
      oneSqMeterRule: false
    },
    capacity: { maxAllowed: 0 }
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [ownerPhotoPreview, setOwnerPhotoPreview] = useState<string | null>(null);

  // OTP Verification States
  const [phoneOTP, setPhoneOTP] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneOTPSent, setPhoneOTPSent] = useState(false);
  const [emailOTPSent, setEmailOTPSent] = useState(false);

  const sendOTP = async (type: "Email" | "Phone", identifier: string) => {
    if (!identifier) return alert(`Please enter your ${type}`);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: type === "Email" ? "Email_Verification" : "Phone_Verification", identifier })
      });
      const data = await res.json();
      if (data.success) {
        if (type === "Email") setEmailOTPSent(true);
        else setPhoneOTPSent(true);
        alert(`OTP sent to ${identifier}`);
      } else alert(data.error);
    } catch { alert("Failed to send OTP"); }
  };

  const verifyOTP = async (type: "Email" | "Phone", identifier: string, code: string) => {
    if (!code) return alert("Please enter the OTP");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: type === "Email" ? "Email_Verification" : "Phone_Verification", identifier, code })
      });
      const data = await res.json();
      if (data.success) {
        if (type === "Email") setEmailVerified(true);
        else setPhoneVerified(true);
      } else alert(data.error);
    } catch { alert("Failed to verify OTP"); }
  };

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, pincode: value }
    }));

    if (value.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setFormData(prev => ({
            ...prev,
            address: {
              ...prev.address,
              areaLocality: postOffice.Name || "",
              city: postOffice.District || postOffice.Region || postOffice.Block || "",
              state: postOffice.State || "Uttar Pradesh",
              pincode: value
            }
          }));
        } else {
          throw new Error("Pincode API failed, trying fallback");
        }
      } catch (error) {
        console.error("Primary API failed, trying fallback", error);
        try {
          const fbRes = await fetch(`https://api.zippopotam.us/IN/${value}`);
          if (fbRes.ok) {
            const fbData = await fbRes.json();
            const place = fbData.places[0];
            setFormData(prev => ({
               ...prev,
               address: {
                 ...prev.address,
                 areaLocality: place["place name"] || "",
                 city: place["state district"] || place["place name"] || "",
                 state: place["state"] || "Uttar Pradesh",
                 pincode: value
               }
            }));
          } else {
            alert("No data found for this Pincode. Please enter details manually.");
          }
        } catch (err) {
          alert("Network error fetching pincode data. Please enter details manually.");
        }
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void, isOwnerPhoto = false) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Step 2: Show preview immediately
      if (isOwnerPhoto) {
        setOwnerPhotoPreview(URL.createObjectURL(file));
      }

      // Step 3: Upload
      const form = new FormData();
      form.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (data.success) callback(data.url);
      } catch (err) {
        alert("Upload failed");
      }
    }
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const area = Number(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      infrastructure: { ...prev.infrastructure, totalArea: area },
      capacity: { maxAllowed: area } // 1 sq.m per student rule
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneVerified || !emailVerified) {
      alert("Please verify both Email and Contact Number via OTP before registering.");
      return;
    }

    const allUndertakingsChecked = Object.values(formData.undertakings).every(v => v === true);
    if (!allUndertakingsChecked) {
      alert("All undertakings must be agreed to before registration.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/institutes/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedId(data.data.instituteId);
        setSuccess(true);
      } else {
        alert(data.error || 'Failed to register institute');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    navigator.clipboard.writeText(`Institute ID: ${generatedId}\nPassword: ${generatedPass}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mockUpload = (field: string) => {
    alert(`Mock Upload triggered for ${field}. In production, this uploads to secure storage.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Registration of Coaching Institute</h2>
        <p className="text-neutral-500 mt-1 max-w-2xl">
          Complete this detailed registration form in accordance with the 2024 Ministry Guidelines. All fields are mandatory.
        </p>
      </div>

      {!success ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm"
        >
          <form onSubmit={handleRegister} className="space-y-6">
            
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-neutral-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-neutral-400" />
                  Institute Display Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    disabled
                    value={formData.name}
                    className="block w-full rounded-md border-0 py-2.5 px-3.5 text-neutral-600 bg-neutral-100 shadow-sm ring-1 ring-inset ring-neutral-200 sm:text-sm sm:leading-6 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-neutral-500">As per new guidelines, names are anonymized publicly.</p>
                </div>
              </div>

              <div className="sm:col-span-2">
                <hr className="border-neutral-100 my-2" />
                <h3 className="text-sm font-semibold text-neutral-900 mt-4 mb-2">Owner / Point of Contact Details</h3>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-neutral-900 flex items-center gap-2">
                  <User className="h-4 w-4 text-neutral-400" />
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    value={formData.ownerDetails.name}
                    onChange={(e) => setFormData({...formData, ownerDetails: {...formData.ownerDetails, name: e.target.value}})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-neutral-900">
                  Aadhaar / PAN Number
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    value={formData.ownerDetails.aadhaarPan}
                    onChange={(e) => setFormData({...formData, ownerDetails: {...formData.ownerDetails, aadhaarPan: e.target.value}})}
                    placeholder="XXXX-XXXX-XXXX"
                    className="block w-full rounded-md border-0 py-2 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium leading-6 text-neutral-900">
                    Contact Number
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="tel"
                      required
                      disabled={phoneVerified}
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={formData.ownerDetails.contact}
                      onChange={(e) => setFormData({...formData, ownerDetails: {...formData.ownerDetails, contact: e.target.value}})}
                      className="block w-full rounded-md border-0 py-2 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm disabled:bg-neutral-100 disabled:text-neutral-500"
                    />
                    {!phoneVerified && (
                      <button type="button" onClick={() => sendOTP("Phone", formData.ownerDetails.contact)} className="whitespace-nowrap rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200">
                        {phoneOTPSent ? "Resend OTP" : "Send OTP"}
                      </button>
                    )}
                  </div>
                  {phoneOTPSent && !phoneVerified && (
                    <div className="mt-2 flex gap-2">
                      <input type="text" placeholder="Enter OTP" maxLength={6} value={phoneOTP} onChange={(e) => setPhoneOTP(e.target.value)} className="block w-full rounded-md border-0 py-1.5 px-3 text-sm ring-1 ring-inset ring-neutral-300" />
                      <button type="button" onClick={() => verifyOTP("Phone", formData.ownerDetails.contact, phoneOTP)} className="whitespace-nowrap rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500">Verify</button>
                    </div>
                  )}
                  {phoneVerified && <p className="mt-1 text-sm font-medium text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Number Verified</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-neutral-900">
                    Official Email Address
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="email"
                      required
                      disabled={emailVerified}
                      value={formData.ownerDetails.email}
                      onChange={(e) => setFormData({...formData, ownerDetails: {...formData.ownerDetails, email: e.target.value}})}
                      className="block w-full rounded-md border-0 py-2 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm disabled:bg-neutral-100 disabled:text-neutral-500"
                    />
                    {!emailVerified && (
                      <button type="button" onClick={() => sendOTP("Email", formData.ownerDetails.email)} className="whitespace-nowrap rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200">
                        {emailOTPSent ? "Resend OTP" : "Send OTP"}
                      </button>
                    )}
                  </div>
                  {emailOTPSent && !emailVerified && (
                    <div className="mt-2 flex gap-2">
                      <input type="text" placeholder="Enter OTP" maxLength={6} value={emailOTP} onChange={(e) => setEmailOTP(e.target.value)} className="block w-full rounded-md border-0 py-1.5 px-3 text-sm ring-1 ring-inset ring-neutral-300" />
                      <button type="button" onClick={() => verifyOTP("Email", formData.ownerDetails.email, emailOTP)} className="whitespace-nowrap rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500">Verify</button>
                    </div>
                  )}
                  {emailVerified && <p className="mt-1 text-sm font-medium text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Email Verified</p>}
                </div>
              </div>

              <div className="sm:col-span-2 flex items-center justify-between p-4 border border-dashed border-neutral-300 rounded-lg">
                <div className="flex items-center gap-4">
                  {ownerPhotoPreview && (
                    <div className="h-12 w-12 rounded-full overflow-hidden border border-neutral-200 shrink-0">
                      <img src={ownerPhotoPreview} alt="Owner Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-neutral-900">Owner Passport Photo</h4>
                    <p className="text-xs text-neutral-500 mt-1">Clear recent photograph max 2MB</p>
                  </div>
                </div>
                <label className="cursor-pointer px-4 py-2 bg-neutral-100 text-sm font-medium rounded-md hover:bg-neutral-200">
                  <span>{formData.ownerDetails.photoUrl && formData.ownerDetails.photoUrl.startsWith('http') ? "Uploaded ✓" : formData.ownerDetails.photoUrl ? "Uploaded ✓" : "Upload Image"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => 
                    handleFileUpload(e, (url) => setFormData({...formData, ownerDetails: {...formData.ownerDetails, photoUrl: url}}), true)
                  } />
                </label>
              </div>

              <div className="sm:col-span-2">
                <hr className="border-neutral-100 my-2" />
                <h3 className="text-sm font-semibold text-neutral-900 mt-4 mb-2">Location & Address</h3>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-neutral-900">Street Address</label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    value={formData.address.street}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-neutral-900">Area / Locality</label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    value={formData.address.areaLocality}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, areaLocality: e.target.value}})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-neutral-900">Pincode (Auto-fills City & State)</label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={formData.address.pincode}
                    onChange={handlePincodeChange}
                    className="block w-full rounded-md border-0 py-2 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-neutral-900">City / District</label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    value={formData.address.city}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-neutral-900">State</label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    value={formData.address.state}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <hr className="border-neutral-100 my-2" />
                <h3 className="text-sm font-semibold text-neutral-900 mt-4 mb-2">Infrastructure & Capacity</h3>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-neutral-900">Number of Classrooms</label>
                <div className="mt-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.infrastructure.totalClassrooms}
                    onChange={(e) => setFormData({...formData, infrastructure: {...formData.infrastructure, totalClassrooms: Number(e.target.value)}})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-neutral-900">Total Classroom Area (sq.m)</label>
                <div className="mt-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.infrastructure.totalArea}
                    onChange={handleAreaChange}
                    className="block w-full rounded-md border-0 py-2 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-indigo-900">Auto-Calculated Approved Max Capacity</h4>
                  <p className="text-xs text-indigo-700">Calculated strictly as Area (sq.m) ÷ 1</p>
                </div>
                <div className="text-3xl font-black text-indigo-600 px-4 py-2 bg-white rounded-lg shadow-sm">
                  {formData.capacity.maxAllowed}
                </div>
              </div>

              <div className="sm:col-span-2">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Mandatory Certificate Uploads</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center justify-between p-4 border border-dashed border-neutral-300 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer">
                    <span className="text-sm font-medium text-neutral-700">{formData.safetyCertificates[0].url.startsWith('/') ? "Fire Safety (Uploaded ✓)" : "Fire Safety Certificate (PDF)"}</span>
                    <Upload className="h-4 w-4 text-neutral-500" />
                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, (url) => {
                        const updated = [...formData.safetyCertificates];
                        updated[0].url = url;
                        setFormData({...formData, safetyCertificates: updated});
                    })}/>
                  </label>
                  <label className="flex items-center justify-between p-4 border border-dashed border-neutral-300 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer">
                    <span className="text-sm font-medium text-neutral-700">{formData.safetyCertificates[1].url.startsWith('/') ? "Building Safety (Uploaded ✓)" : "Building Safety Certificate (PDF)"}</span>
                    <Upload className="h-4 w-4 text-neutral-500" />
                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, (url) => {
                        const updated = [...formData.safetyCertificates];
                        updated[1].url = url;
                        setFormData({...formData, safetyCertificates: updated});
                    })}/>
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Mandatory Facilities</h3>
                <div className="grid grid-cols-2 gap-4 border border-neutral-200 rounded-lg p-5 bg-white">
                  {['First Aid', 'CCTV', 'Ventilation', 'Separate Toilets', 'Emergency Exits'].map((facility, i) => {
                    const keys = ['firstAid', 'cctvInstalled', 'ventilation', 'separateToilets', 'emergencyExits'] as const;
                    const key = keys[i];
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <label className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-600"
                            checked={formData.facilities[key]}
                            onChange={(e) => setFormData({...formData, facilities: {...formData.facilities, [key]: e.target.checked}})}
                          />
                          {facility} Required
                        </label>
                        <label className="cursor-pointer text-xs text-indigo-600 hover:text-indigo-800 underline">
                          Add Photo
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => {
                            setFormData({...formData, facilities: {...formData.facilities, facilityPhotos: [...formData.facilities.facilityPhotos, url]}});
                          })}/>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="sm:col-span-2">
                <hr className="border-neutral-100 my-2" />
                <h3 className="text-sm font-semibold text-red-700 mt-4 mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Statutory Undertakings
                </h3>
                <div className="space-y-4 bg-red-50/50 p-5 rounded-lg border border-red-100">
                  <label className="flex items-start gap-3 text-sm text-neutral-800 cursor-pointer">
                    <input type="checkbox" required className="mt-1 h-4 w-4" checked={formData.undertakings.noUnder16} onChange={(e) => setFormData({...formData, undertakings: {...formData.undertakings, noUnder16: e.target.checked}})} />
                    I undertake that the institute will NOT enroll any student below 16 years of age.
                  </label>
                  <label className="flex items-start gap-3 text-sm text-neutral-800 cursor-pointer">
                    <input type="checkbox" required className="mt-1 h-4 w-4" checked={formData.undertakings.noSchoolHours} onChange={(e) => setFormData({...formData, undertakings: {...formData.undertakings, noSchoolHours: e.target.checked}})} />
                    I undertake that classes will NOT be conducted during regular school hours.
                  </label>
                  <label className="flex items-start gap-3 text-sm text-neutral-800 cursor-pointer">
                    <input type="checkbox" required className="mt-1 h-4 w-4" checked={formData.undertakings.graduateTutors} onChange={(e) => setFormData({...formData, undertakings: {...formData.undertakings, graduateTutors: e.target.checked}})} />
                    I undertake that all tutors hold a minimum of a graduation degree.
                  </label>
                  <label className="flex items-start gap-3 text-sm text-neutral-800 cursor-pointer">
                    <input type="checkbox" required className="mt-1 h-4 w-4" checked={formData.undertakings.noMisleadingAds} onChange={(e) => setFormData({...formData, undertakings: {...formData.undertakings, noMisleadingAds: e.target.checked}})} />
                    I undertake that the institute will not publish misleading advertisements.
                  </label>
                  <label className="flex items-start gap-3 text-sm text-neutral-800 cursor-pointer">
                    <input type="checkbox" required className="mt-1 h-4 w-4" checked={formData.undertakings.oneSqMeterRule} onChange={(e) => setFormData({...formData, undertakings: {...formData.undertakings, oneSqMeterRule: e.target.checked}})} />
                    I undertake to strictly follow the minimum 1 sq.m per student per classroom rule.
                  </label>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-end gap-x-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto rounded-md bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 flex justify-center items-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                    Processing Protocol...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    Submit Formal Registration
                  </>
                )}
              </button>
            </div>
            
          </form>
        </motion.div>

      ) : (

        // SUCCESS STATE (Pending Approval)
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-indigo-200 bg-white p-8 shadow-sm text-center max-w-2xl mx-auto mt-12"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 mb-6">
            <CheckCircle2 className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">Application Submitted Successfully</h3>
          <p className="text-neutral-600 mb-8 px-4">
            Your application is now <strong className="text-amber-600">Pending Approval</strong> by the District Education Officer. 
            Once approved, your secure Login ID and Password will be actively dispatched to your verified Email and Mobile Number.
          </p>

          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 mb-8 text-center relative overflow-hidden">
            <div className="space-y-2 relative z-0">
              <p className="text-xs font-semibold uppercase text-neutral-500 tracking-wider mb-1">Application Reference ID</p>
              <p className="text-2xl font-mono font-bold text-neutral-900 bg-white inline-block px-3 py-1 rounded border border-neutral-200 select-all">{generatedId}</p>
            </div>
            <p className="text-xs text-neutral-400 mt-4">Save this reference ID to track your application status.</p>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => {
                setSuccess(false);
                setFormData(defaultFormData);
                setOwnerPhotoPreview(null);
                setPhoneOTP(""); setEmailOTP("");
                setPhoneVerified(false); setEmailVerified(false);
                setPhoneOTPSent(false); setEmailOTPSent(false);
              }}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-6 py-2.5 rounded-lg transition-colors"
            >
              Submit Another Application
            </button>
            <Link 
              href="/"
              className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-lg transition-colors"
            >
              Back to Home <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      )}

    </div>
  );
}
