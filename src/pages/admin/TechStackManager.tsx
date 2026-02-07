import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { AppDispatch, RootState } from '../../store/store';
import { 
  fetchTechStacksAction, 
  createTechStackAction, 
  deleteTechStackAction 
} from '../../store/slice/techStackSlice';
import { uploadFileAction } from '../../store/slice/mediaSlice'; // Import action upload
import { TechStackRequest, TechStackResponse } from '../../type/techstack';
import { Plus, Pencil, Trash2, X, Upload, Loader2 } from 'lucide-react'; 

const TechStackManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading } = useSelector((state: RootState) => state.techStack);
  const { isUploading } = useSelector((state: RootState) => state.media); // Lấy trạng thái upload từ mediaSlice
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<TechStackRequest>();
  
  // Watch cái iconUrl để hiển thị preview ảnh ngay khi upload xong
  const currentIconUrl = watch('iconUrl');

  useEffect(() => {
    dispatch(fetchTechStacksAction());
  }, [dispatch]);

  // Logic xử lý upload file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dispatch action upload lên Cloudinary (để folder là techstacks)
    const resultAction = await dispatch(uploadFileAction({ file, folder: 'techstacks' }));

    if (uploadFileAction.fulfilled.match(resultAction)) {
      // Thành công: Set cái URL trả về vào field iconUrl của form
      setValue('iconUrl', resultAction.payload);
    } else {
      alert("Lỗi upload rồi bro: " + resultAction.payload);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    reset({ name: '', iconUrl: '', proficiency: '', category: 'FRONTEND' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TechStackResponse) => {
    setEditingId(item.id);
    reset(item); // Reset nhanh toàn bộ giá trị của item vào form
    setIsModalOpen(true);
  };

  const onSubmit = (data: TechStackRequest) => {
    if (editingId) {
      console.log("Update logic here", data);
    } else {
      dispatch(createTechStackAction(data));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Xóa công nghệ này nhé bro?")) {
      dispatch(deleteTechStackAction(id));
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen rounded-lg shadow">
      {/* Header & Table giữ nguyên như cũ của ông */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Tech Stack</h1>
        <button onClick={handleOpenAdd} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Plus size={20} className="mr-2" /> Thêm mới
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">Icon</th>
              <th className="p-4 font-semibold text-gray-600">Tên</th>
              <th className="p-4 font-semibold text-gray-600">Loại</th>
              <th className="p-4 font-semibold text-gray-600">Trình độ</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(items) && items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4"><img src={item.iconUrl} alt={item.name} className="w-10 h-10 object-contain" /></td>
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">{item.category}</span></td>
                <td className="p-4 font-medium">{item.proficiency}</td>
                <td className="p-4">
                  <div className="flex justify-center space-x-3">
                    <button onClick={() => handleOpenEdit(item)} className="text-yellow-600 hover:text-yellow-700"><Pencil size={18} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa đã ghép Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingId ? 'Sửa công nghệ' : 'Thêm công nghệ mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên công nghệ</label>
                <input {...register('name')} className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              {/* KHU VỰC UPLOAD ẢNH */}
              <div>
                <label className="block text-sm font-medium mb-1">Icon công nghệ</label>
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                      {currentIconUrl ? (
                        <img src={currentIconUrl} alt="Preview" className="w-full h-full object-contain" />
                      ) : (
                        <Upload className="text-gray-400" />
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                          <Loader2 className="animate-spin text-blue-600" />
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      onChange={handleFileChange} 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="image/*"
                      disabled={isUploading}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {isUploading ? "Đang lên mây..." : "Click để chọn ảnh hoặc kéo thả"}
                  </div>
                </div>
                {/* Input ẩn để hook-form lưu URL */}
                <input type="hidden" {...register('iconUrl')} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Loại</label>
                <select {...register('category')} className="w-full border rounded-lg p-2">
                  <option value="FRONTEND">FRONTEND</option>
                  <option value="BACKEND">BACKEND</option>
                  <option value="DATABASE">DATABASE</option>
                  <option value="TOOL">TOOL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Trình độ (%)</label>
                <input {...register('proficiency')} className="w-full border rounded-lg p-2" placeholder="VD: 90%" />
              </div>

              <button 
                type="submit" 
                disabled={isUploading}
                className={`w-full py-2 rounded-lg font-semibold text-white transition mt-4 ${isUploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {editingId ? 'Cập nhật' : 'Lưu ngay'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechStackManager;