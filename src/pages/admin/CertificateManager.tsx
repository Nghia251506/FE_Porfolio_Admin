import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchAllCertificates, createCertificate } from "../../store/slice/certificateSlice";
import { uploadFileAction } from "../../store/slice/mediaSlice";
import { Plus, X, Loader2, Upload, ExternalLink, Award, Calendar, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { CertificateRequest } from "../../type/certificate";

export default function CertificateManager() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Lấy dữ liệu từ Redux Store
  const { items: certificates, isLoading, error } = useSelector((state: RootState) => state.certificate);
  const { isUploading } = useSelector((state: RootState) => state.media);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Khởi tạo Form
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CertificateRequest>({
    defaultValues: {
      name: "",
      organization: "",
      issueDate: "",
      expirationDate: "",
      credentialUrl: "",
      imageUrl: ""
    }
  });

  const imageUrlPreview = watch("imageUrl");

  useEffect(() => {
    dispatch(fetchAllCertificates());
  }, [dispatch]);

  // Logic Upload Ảnh
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const resultAction = await dispatch(uploadFileAction({ file, folder: "certificates" }));
    if (uploadFileAction.fulfilled.match(resultAction)) {
      setValue("imageUrl", resultAction.payload, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: CertificateRequest) => {
    const result = await dispatch(createCertificate(data));
    if (createCertificate.fulfilled.match(result)) {
      setIsModalOpen(false);
      reset();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Certificates</h1>
          <p className="text-gray-500 font-medium">Manage and showcase your professional achievements 🏆</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <Plus size={20} /> Add Certificate
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="font-bold text-sm">{error}</span>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      {isLoading ? (
        // 1. LOADING STATE (SKELETON)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-44 bg-gray-100 rounded-2xl mb-4"></div>
              <div className="h-5 bg-gray-100 rounded-lg w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-50 rounded-lg w-1/2"></div>
            </div>
          ))}
        </div>
      ) : certificates.length === 0 ? (
        // 2. EMPTY STATE
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
          <div className="p-8 bg-indigo-50 rounded-full mb-6">
            <Award size={64} className="text-indigo-300" />
          </div>
          <h2 className="text-2xl font-black text-gray-800">No Certificates Found</h2>
          <p className="text-gray-500 mt-2 mb-8 font-medium">Your trophy cabinet is currently empty.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
          >
            Upload First Certificate
          </button>
        </div>
      ) : (
        // 3. DATA STATE (GRID LIST)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-52 bg-gray-100 relative overflow-hidden">
                <img 
                  src={cert.imageUrl} 
                  alt={cert.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-indigo-600 shadow-sm uppercase tracking-wider">
                  {cert.organization}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-4">{cert.name}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                    <Calendar size={16} className="text-indigo-400" />
                    <span>Issued: {cert.issueDate}</span>
                  </div>
                  {cert.expirationDate && (
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                      <Award size={16} className="text-amber-400" />
                      <span>Expires: {cert.expirationDate}</span>
                    </div>
                  )}
                </div>
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-50 text-indigo-700 rounded-2xl text-sm font-black hover:bg-indigo-600 hover:text-white transition-all"
                >
                  VERIFY CREDENTIAL <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Add Achievement</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Certificate Name</label>
                  <input 
                    {...register("name", { required: "Name is required" })} 
                    className="w-full mt-1.5 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all" 
                    placeholder="e.g. Professional Cloud Architect"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Issuing Organization</label>
                  <input 
                    {...register("organization", { required: true })} 
                    className="w-full mt-1.5 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500" 
                    placeholder="e.g. Google Cloud"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Credential URL</label>
                  <input 
                    {...register("credentialUrl")} 
                    className="w-full mt-1.5 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500" 
                    placeholder="https://bcert.me/..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Issue Date</label>
                  <input type="date" {...register("issueDate", { required: true })} className="w-full mt-1.5 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Expiration Date</label>
                  <input type="date" {...register("expirationDate")} className="w-full mt-1.5 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              {/* IMAGE UPLOAD ZONE */}
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Certificate Preview</label>
                <div className="mt-2 h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex items-center justify-center relative overflow-hidden group hover:border-indigo-300 transition-colors">
                  {imageUrlPreview ? (
                    <>
                      <img src={imageUrlPreview} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="text-white" size={32} />
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="animate-spin text-indigo-500" size={32} />
                          <span className="text-[10px] font-bold text-indigo-500">UPLOADING...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto text-gray-300 mb-2" size={40} />
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Drop certificate image here</p>
                        </>
                      )}
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleUploadImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <input type="hidden" {...register("imageUrl", { required: true })} />
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading || isLoading}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 disabled:bg-indigo-300 transition-all active:scale-95"
                >
                  {isLoading ? "Processing..." : "Save Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}