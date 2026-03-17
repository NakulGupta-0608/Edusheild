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
              city: postOffice.District || postOffice.Block || postOffice.Name,
              state: postOffice.State || "Uttar Pradesh",
              pincode: value
            }
          }));
        }
      } catch (error) {
        console.error("Failed to fetch pincode details", error);
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
        setGeneratedPass(data.data.password);
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

              <div>
                <label className="block text-sm font-medium leading-6 text-neutral-900">
                  Contact Number
                </label>
                <div className="mt-2">
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={formData.ownerDetails.contact}
                    onChange={(e) => setFormData({...formData, ownerDetails: {...formData.ownerDetails, contact: e.target.value}})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-neutral-900">
                  Official Email Address
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    required
                    value={formData.ownerDetails.email}
                    onChange={(e) => setFormData({...formData, ownerDetails: {...formData.ownerDetails, email: e.target.value}})}
                    className="block w-full rounded-md border-0 py-2 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 flex items-center justify-between p-4 border border-dashed border-neutral-300 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-neutral-900">Owner Passport Photo</h4>
                  <p className="text-xs text-neutral-500 mt-1">Clear recent photograph max 2MB</p>
                </div>
                <button type="button" onClick={() => mockUpload('Photo')} className="px-4 py-2 bg-neutral-100 text-sm font-medium rounded-md hover:bg-neutral-200">
                  Upload Image
                </button>
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
                  <div className="flex items-center justify-between p-4 border border-dashed border-neutral-300 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer" onClick={() => mockUpload('Fire Safety')}>
                    <span className="text-sm font-medium text-neutral-700">Fire Safety Certificate (PDF)</span>
                    <Upload className="h-4 w-4 text-neutral-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-dashed border-neutral-300 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer" onClick={() => mockUpload('Building Safety')}>
                    <span className="text-sm font-medium text-neutral-700">Building Safety Certificate (PDF)</span>
                    <Upload className="h-4 w-4 text-neutral-500" />
                  </div>
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
                        <button type="button" onClick={() => mockUpload(`${facility} Photo`)} className="text-xs text-indigo-600 hover:text-indigo-800 underline">Add Photo</button>
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

        // SUCCESS STATE (Same as before)
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-emerald-200 bg-white p-8 shadow-sm text-center max-w-2xl mx-auto mt-12"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">Registration Completed</h3>
          <p className="text-neutral-600 mb-8 px-4">
            A secure ID and password have been generated for the coaching center. Share these credentials securely with the absolute owner.
          </p>

          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 mb-8 text-left relative overflow-hidden group">
            <button 
              onClick={copyCredentials}
              className="absolute top-4 right-4 p-2 bg-white border border-neutral-200 rounded text-neutral-500 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm flex items-center gap-2 text-xs font-semibold z-10"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500"/> : <Copy className="h-4 w-4"/>}
              {copied ? "Copied" : "Copy"}
            </button>
            
            <div className="space-y-4 relative z-0">
              <div>
                <p className="text-xs font-semibold uppercase text-neutral-500 tracking-wider mb-1">Institute ID</p>
                <p className="text-2xl font-mono font-bold text-neutral-900 bg-white inline-block px-3 py-1 rounded border border-neutral-200 select-all">{generatedId}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-neutral-500 tracking-wider mb-1">Temporary Password</p>
                <p className="text-lg font-mono font-medium text-neutral-900 bg-white inline-block px-3 py-1 rounded border border-neutral-200 select-all">{generatedPass}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => {
                setSuccess(false);
                setFormData(defaultFormData);
              }}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-6 py-2.5 rounded-lg transition-colors"
            >
              Register Another
            </button>
            <Link 
              href="/admin/dashboard"
              className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-lg transition-colors"
            >
              Back to Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      )}

    </div>
  );
}
